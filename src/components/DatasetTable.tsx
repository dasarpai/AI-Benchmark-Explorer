import React, { useMemo, useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Paper,
  Link,
  useMediaQuery,
  useTheme,
  TablePagination
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { Dataset } from '../types';

interface DatasetTableProps {
  datasets: Dataset[];
  isLoading: boolean;
  onSelectDataset: (dataset: Dataset) => void;
}

const DatasetTable: React.FC<DatasetTableProps> = ({ 
  datasets, 
  isLoading, 
  onSelectDataset 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Define columns based on screen size
  const columns = useMemo(() => {
    // Base columns that appear on all screen sizes
    const baseColumns = [
      { Header: 'Name', accessor: 'dataset_id', width: isMobile ? '60%' : '40%' },
    ];
    
    // Papers with Code column now appears before Task
    const pwcColumn = [
      { Header: 'PWC-Link', accessor: 'pwc_url', width: isMobile ? '20%' : '10%' },
      { Header: 'Task', accessor: 'task', width: isMobile ? '20%' : '15%' },
    ];
    
    // New count columns
    const countColumns = !isMobile ? [
      { Header: 'Benchmark Cnt', accessor: 'benchmark_cnt', width: '10%' },
      { Header: 'Task Cnt', accessor: 'associated_task_cnt', width: '10%' },
    ] : [];
    
    // Additional columns for larger screens
    const desktopColumns = [
      { Header: 'Modalities', accessor: 'modalities', width: '15%' },
      { Header: 'Area', accessor: 'area', width: '15%' },
      { Header: 'License', accessor: 'license', width: '10%' },
      { Header: 'Year', accessor: 'year_published', width: '10%' },
    ];
    
    return isMobile 
      ? [...baseColumns, ...pwcColumn]
      : [...baseColumns, ...pwcColumn, ...countColumns, ...desktopColumns];
  }, [isMobile]);

  // Calculate benchmark and associated task counts
  const datasetsWithCounts = useMemo(() => {
    return datasets.map(dataset => {
      // Count benchmarks
      const benchmarkCount = dataset.benchmark_urls ? 
        dataset.benchmark_urls.split(',').filter(url => url.trim().length > 0).length : 0;
      
      // Count associated tasks
      const associatedTaskCount = dataset.associated_tasks ? 
        dataset.associated_tasks.split(',').filter(task => task.trim().length > 0).length : 0;
      
      return {
        ...dataset,
        benchmark_cnt: benchmarkCount.toString(),
        associated_task_cnt: associatedTaskCount.toString()
      };
    });
  }, [datasets]);

  // Get current page data
  const currentPageData = useMemo(() => {
    return datasetsWithCounts.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [datasetsWithCounts, page, rowsPerPage]);

  // Handle link click without triggering row selection
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (datasetsWithCounts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Typography variant="h6" color="text.secondary">No datasets found matching your criteria</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.accessor} 
                  width={column.width}
                  sx={{ 
                    padding: isMobile ? '8px 4px' : '8px 16px',
                    whiteSpace: 'nowrap' 
                  }}
                >
                  <Typography fontWeight="bold" variant={isMobile ? "body2" : "body1"}>
                    {column.Header}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((dataset) => (
              <TableRow 
                key={dataset.sno}
                hover
                sx={{ cursor: 'pointer' }}
              >
                {columns.map((column) => {
                  // Special handling for the Papers with Code column
                  if (column.accessor === 'pwc_url') {
                    return (
                      <TableCell 
                        key={column.accessor}
                        sx={{ 
                          padding: isMobile ? '8px 4px' : '8px 16px',
                          maxWidth: column.width,
                          whiteSpace: 'normal',
                          wordWrap: 'break-word'
                        }}
                      >
                        {dataset.pwc_url ? (
                          <Link 
                            href={dataset.pwc_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleLinkClick}
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            <LaunchIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant={isMobile ? "caption" : "body2"}>
                              {isMobile ? "View" : "PWC"}
                            </Typography>
                          </Link>
                        ) : (
                          <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                    );
                  }
                  
                  // Special handling for the modalities column
                  if (column.accessor === 'modalities' && !isMobile) {
                    return (
                      <TableCell 
                        key={column.accessor}
                        onClick={() => onSelectDataset(dataset)}
                        sx={{ 
                          padding: '8px 16px',
                          maxWidth: column.width,
                          whiteSpace: 'normal',
                          wordWrap: 'break-word'
                        }}
                      >
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {dataset.modalities.split(',').map((modality, index) => (
                            modality.trim() && (
                              <Chip 
                                key={index} 
                                label={modality.trim()} 
                                size="small" 
                                color="primary" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            )
                          ))}
                        </Stack>
                      </TableCell>
                    );
                  }
                  
                  // Standard column rendering
                  return (
                    <TableCell 
                      key={column.accessor}
                      onClick={() => onSelectDataset(dataset)}
                      sx={{ 
                        padding: isMobile ? '8px 4px' : '8px 16px',
                        maxWidth: column.width,
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        fontWeight: column.accessor === 'dataset_id' ? 'medium' : 'normal'
                      }}
                    >
                      {column.accessor === 'task' ? (
                        <Typography variant={isMobile ? "caption" : "body2"}>
                          {dataset[column.accessor as keyof Dataset]}
                        </Typography>
                      ) : (
                        dataset[column.accessor as keyof Dataset] || 'N/A'
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={datasetsWithCounts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[25, 50, 100, 250]}
        labelRowsPerPage="Entries per page:"
        sx={{ 
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            margin: 0,
          }
        }}
      />
    </Box>
  );
};

export default DatasetTable;
