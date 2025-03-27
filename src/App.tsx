import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography, Alert, CircularProgress } from '@mui/material';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import DatasetTable from './components/DatasetTable';
import { Dataset, FilterState } from './types';
import { parseCSV, getUniqueValues } from './utils/dataUtils';

// Lazy load the detail component to improve initial load time
const DatasetDetail = lazy(() => import('./components/DatasetDetail'));

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  // Add this to improve performance
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
        },
      },
    },
  },
});

function App() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    tasks: [],
    modalities: [],
    areas: [],
    years: [],
  });

  // Load data with better error handling and performance
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try different paths to find the CSV file
        let data: Dataset[] = [];
        const paths = [
          '/data/paperswithcode_datasets.csv',
          './data/paperswithcode_datasets.csv',
          '../csv/paperswithcode_datasets.csv'
        ];
        
        let loadError: Error | null = null;
        
        for (const path of paths) {
          try {
            console.time(`Loading CSV from ${path}`);
            data = await parseCSV(path, controller.signal);
            console.timeEnd(`Loading CSV from ${path}`);
            
            if (data.length > 0) {
              break;
            }
          } catch (e) {
            console.log(`Failed to load from ${path}:`, e);
            loadError = e instanceof Error ? e : new Error(String(e));
          }
        }
        
        if (data.length === 0) {
          throw loadError || new Error('No data loaded from CSV file');
        }
        
        if (isMounted) {
          setDatasets(data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (isMounted) {
          setError('Failed to load dataset. Please check the console for details.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Extract unique values for filters - memoized to prevent recalculation
  const availableFilters = useMemo(() => {
    console.time('Calculating filters');
    const filters = {
      tasks: getUniqueValues(datasets, 'task'),
      modalities: getUniqueValues(datasets, 'modalities'),
      areas: getUniqueValues(datasets, 'area'),
      years: getUniqueValues(datasets, 'year_published').filter(Boolean),
    };
    console.timeEnd('Calculating filters');
    return filters;
  }, [datasets]);

  // Apply filters and search - optimized with early returns
  const filteredDatasets = useMemo(() => {
    console.time('Filtering datasets');
    
    // Quick return if no filters or search
    if (!searchQuery && 
        filters.tasks.length === 0 && 
        filters.modalities.length === 0 && 
        filters.areas.length === 0 && 
        filters.years.length === 0) {
      console.timeEnd('Filtering datasets');
      return datasets;
    }
    
    const results = datasets.filter(dataset => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          dataset.dataset_id,
          dataset.task,
          dataset.subtask,
          dataset.description,
          dataset.area
        ];
        
        const matchesSearch = searchableFields.some(field => 
          field && field.toLowerCase().includes(query)
        );
        
        if (!matchesSearch) return false;
      }
      
      // Task filter
      if (filters.tasks.length > 0) {
        const datasetTasks = dataset.task.split(',').map(t => t.trim());
        if (!filters.tasks.some(task => datasetTasks.includes(task))) {
          return false;
        }
      }
      
      // Modalities filter
      if (filters.modalities.length > 0) {
        const datasetModalities = dataset.modalities.split(',').map(m => m.trim());
        if (!filters.modalities.some(modality => datasetModalities.includes(modality))) {
          return false;
        }
      }
      
      // Area filter
      if (filters.areas.length > 0 && !filters.areas.includes(dataset.area)) {
        return false;
      }
      
      // Year filter
      if (filters.years.length > 0 && !filters.years.includes(dataset.year_published)) {
        return false;
      }
      
      return true;
    });
    
    console.timeEnd('Filtering datasets');
    return results;
  }, [datasets, searchQuery, filters]);

  // Handle dataset selection
  const handleSelectDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setIsDetailOpen(true);
  };

  // Handle closing the detail modal
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress size={60} />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {!isLoading && !error && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ width: { xs: '100%', md: '25%' } }}>
                <FilterPanel
                  filters={filters}
                  setFilters={setFilters}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  availableFilters={availableFilters}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '75%' } }}>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 3, 
                  borderRadius: 1,
                  boxShadow: 1
                }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Datasets {`(${filteredDatasets.length})`}
                  </Typography>
                  <DatasetTable
                    datasets={filteredDatasets}
                    isLoading={false}
                    onSelectDataset={handleSelectDataset}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </Container>
        
        <Suspense fallback={<CircularProgress />}>
          {selectedDataset && (
            <DatasetDetail
              dataset={selectedDataset}
              isOpen={isDetailOpen}
              onClose={handleCloseDetail}
            />
          )}
        </Suspense>
      </Box>
    </ThemeProvider>
  );
}

export default App;
