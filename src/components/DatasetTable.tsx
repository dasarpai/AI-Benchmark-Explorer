import React, { useMemo } from 'react';
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
  useTheme
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

  // Define columns based on screen size
  const columns = useMemo(() => {
    // Base columns that appear on all screen sizes
    const baseColumns = [
      { Header: 'Name', accessor: 'dataset_id', width: isMobile ? '60%' : '60%' },
    ];
    
    // Papers with Code column now appears before Task
    const pwcColumn = [
      { Header: 'PWC-Link', accessor: 'pwc_url', width: isMobile ? '20%' : '10%' },
      { Header: 'Task', accessor: 'task', width: isMobile ? '20%' : '20%' },
    ];
    
    // Additional columns for larger screens
    const desktopColumns = [
      { Header: 'Modalities', accessor: 'modalities', width: '15%' },
      { Header: 'Area', accessor: 'area', width: '15%' },
      { Header: 'License', accessor: 'license', width: '10%' },
      { Header: 'Year', accessor: 'year_published', width: '10%' },
    ];
    
    return isMobile 
      ? [...baseColumns, ...pwcColumn]
      : [...baseColumns, ...pwcColumn, ...desktopColumns];
  }, [isMobile]);

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

  if (datasets.length === 0) {
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
            {datasets.map((dataset) => (
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
    </Box>
  );
};

export default React.memo(DatasetTable);
