import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  Link,
  Divider,
  IconButton,
  Stack,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';
import { Dataset } from '../types';

interface DatasetDetailProps {
  dataset: Dataset | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function moved outside the component to avoid hooks rule issues
const formatTasks = (tasks?: string): string[] => {
  if (!tasks) return [];
  return tasks.split(',').map(task => task.trim()).filter(Boolean);
};

// Helper function to format benchmark URLs
const formatBenchmarkUrls = (benchmarkUrls?: string) => {
  if (!benchmarkUrls) return [];
  
  return benchmarkUrls
    .split(',')
    .map(url => url.trim())
    .filter(Boolean)
    .map(url => ({
      url: `https://paperswithcode.com/sota/${url}`,
      name: url.split('/').pop() || url
    }));
};

const DatasetDetail: React.FC<DatasetDetailProps> = ({ dataset, isOpen, onClose }) => {
  // Render nothing if no dataset (but after hooks would be called)
  const dialogContent = !dataset ? null : (
    <>
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h5">{dataset.dataset_id}</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Task</Typography>
          <Chip label={dataset.task} size="small" />
          {dataset.subtask && dataset.subtask !== dataset.task && (
            <Chip label={dataset.subtask} size="small" sx={{ ml: 1 }} />
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Description</Typography>
          <Typography variant="body1">{dataset.description || 'No description available'}</Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Area</Typography>
              <Typography variant="body1">{dataset.area || 'N/A'}</Typography>
            </Paper>
          </Box>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Year Published</Typography>
              <Typography variant="body1">{dataset.year_published || 'N/A'}</Typography>
            </Paper>
          </Box>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Dataset Size</Typography>
              <Typography variant="body1">{dataset.dataset_size || 'N/A'}</Typography>
            </Paper>
          </Box>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">License</Typography>
              <Typography variant="body1">{dataset.license || 'N/A'}</Typography>
            </Paper>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Modalities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formatTasks(dataset.modalities).length > 0 ? 
                  formatTasks(dataset.modalities).map((modality, index) => (
                    <Chip key={index} label={modality} size="small" />
                  )) : 
                  <Typography variant="body2">No modalities available</Typography>
                }
              </Box>
            </Paper>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Associated Tasks</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formatTasks(dataset.associated_tasks).length > 0 ? 
                  formatTasks(dataset.associated_tasks).map((task, index) => (
                    <Chip key={index} label={task} size="small" />
                  )) : 
                  <Typography variant="body2">No associated tasks available</Typography>
                }
              </Box>
            </Paper>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Languages</Typography>
              <Typography variant="body1">{dataset.languages || 'N/A'}</Typography>
            </Paper>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Benchmark URLs Section */}
        {formatBenchmarkUrls(dataset.benchmark_urls).length > 0 && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Benchmarks</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {formatBenchmarkUrls(dataset.benchmark_urls).map((benchmark, index) => (
                  <Box key={index} sx={{ width: { xs: '100%', md: 'calc(50% - 8px)' } }}>
                    <Link 
                      href={benchmark.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Typography variant="body2" noWrap>
                        {benchmark.name}
                      </Typography>
                      <LaunchIcon fontSize="small" />
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>External Links</Typography>
          <Stack spacing={2}>
            {dataset.homepage_url && (
              <Link 
                href={dataset.homepage_url} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <Typography variant="body1">Homepage</Typography>
                <LaunchIcon fontSize="small" />
              </Link>
            )}
            {dataset.pwc_url && (
              <Link 
                href={dataset.pwc_url} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <Typography variant="body1">Papers With Code</Typography>
                <LaunchIcon fontSize="small" />
              </Link>
            )}
            {dataset.paper_url && (
              <Link 
                href={dataset.paper_url} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <Typography variant="body1">Research Paper</Typography>
                <LaunchIcon fontSize="small" />
              </Link>
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      {dialogContent}
    </Dialog>
  );
};

export default DatasetDetail;
