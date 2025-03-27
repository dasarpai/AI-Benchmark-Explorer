import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  SelectChangeEvent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import { FilterState } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  availableFilters: {
    tasks: string[];
    modalities: string[];
    areas: string[];
    years: string[];
  };
}

// Maximum number of items to show in each filter section
const MAX_VISIBLE_ITEMS = 20;

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  availableFilters,
}) => {
  // Local state for search input to implement debouncing
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  // Filter search states
  const [taskSearch, setTaskSearch] = useState("");
  const [modalitySearch, setModalitySearch] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  
  // Track expanded state of accordions
  const [expanded, setExpanded] = useState<string | false>('task');
  
  // Handle accordion expansion
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Debounced search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    
    // Use a timeout to debounce the search
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [setSearchQuery]);

  // Optimized filter change handler
  const handleFilterChange = useCallback((filterType: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = [...prev[filterType]];
      if (checked) {
        return { ...prev, [filterType]: [...currentValues, value] };
      } else {
        return { ...prev, [filterType]: currentValues.filter(item => item !== value) };
      }
    });
  }, [setFilters]);

  // Handle year selection
  const handleYearChange = useCallback((event: SelectChangeEvent<string[]>) => {
    setFilters(prev => ({
      ...prev,
      years: event.target.value as string[]
    }));
  }, [setFilters]);
  
  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      tasks: [],
      modalities: [],
      areas: [],
      years: []
    });
    setLocalSearchQuery('');
    setSearchQuery('');
    setTaskSearch('');
    setModalitySearch('');
    setAreaSearch('');
  }, [setFilters, setSearchQuery]);
  
  // Filtered and limited task options
  const filteredTasks = useMemo(() => {
    const filtered = taskSearch 
      ? availableFilters.tasks.filter(task => 
          task.toLowerCase().includes(taskSearch.toLowerCase()))
      : availableFilters.tasks;
    
    return filtered.slice(0, MAX_VISIBLE_ITEMS);
  }, [availableFilters.tasks, taskSearch]);
  
  // Filtered and limited modality options
  const filteredModalities = useMemo(() => {
    const filtered = modalitySearch 
      ? availableFilters.modalities.filter(modality => 
          modality.toLowerCase().includes(modalitySearch.toLowerCase()))
      : availableFilters.modalities;
    
    return filtered.slice(0, MAX_VISIBLE_ITEMS);
  }, [availableFilters.modalities, modalitySearch]);
  
  // Filtered and limited area options
  const filteredAreas = useMemo(() => {
    const filtered = areaSearch 
      ? availableFilters.areas.filter(area => 
          area.toLowerCase().includes(areaSearch.toLowerCase()))
      : availableFilters.areas;
    
    return filtered.slice(0, MAX_VISIBLE_ITEMS);
  }, [availableFilters.areas, areaSearch]);
  
  // Count active filters
  const activeFilterCount = useMemo(() => 
    filters.tasks.length + 
    filters.modalities.length + 
    filters.areas.length + 
    filters.years.length
  , [filters]);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        width: '100%',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto'
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Search & Filter</Typography>
          {activeFilterCount > 0 && (
            <Button 
              size="small" 
              startIcon={<ClearIcon />} 
              onClick={handleClearFilters}
              color="primary"
            >
              Clear All
            </Button>
          )}
        </Box>
        
        <TextField
          placeholder="Search datasets..."
          value={localSearchQuery}
          onChange={handleSearchChange}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: localSearchQuery ? (
              <InputAdornment position="end">
                <ClearIcon 
                  fontSize="small" 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setLocalSearchQuery('');
                    setSearchQuery('');
                  }}
                />
              </InputAdornment>
            ) : null,
          }}
        />

        <Accordion 
          expanded={expanded === 'task'} 
          onChange={handleAccordionChange('task')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">
              Task {filters.tasks.length > 0 && `(${filters.tasks.length})`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              <TextField
                placeholder="Search tasks..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                <List dense disablePadding>
                  {filteredTasks.map((task) => (
                    <ListItem key={task} dense disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox 
                          edge="start"
                          checked={filters.tasks.includes(task)}
                          onChange={(e) => handleFilterChange('tasks', task, e.target.checked)}
                          size="small"
                        />
                      </ListItemIcon>
                      <ListItemText primary={task} />
                    </ListItem>
                  ))}
                  {taskSearch && filteredTasks.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No matching tasks" />
                    </ListItem>
                  )}
                </List>
              </Box>
              
              {availableFilters.tasks.length > MAX_VISIBLE_ITEMS && !taskSearch && (
                <Typography variant="caption" color="text.secondary">
                  Showing {MAX_VISIBLE_ITEMS} of {availableFilters.tasks.length} tasks. Use search to find more.
                </Typography>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'modality'} 
          onChange={handleAccordionChange('modality')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">
              Modalities {filters.modalities.length > 0 && `(${filters.modalities.length})`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              <TextField
                placeholder="Search modalities..."
                value={modalitySearch}
                onChange={(e) => setModalitySearch(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                <List dense disablePadding>
                  {filteredModalities.map((modality) => (
                    <ListItem key={modality} dense disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox 
                          edge="start"
                          checked={filters.modalities.includes(modality)}
                          onChange={(e) => handleFilterChange('modalities', modality, e.target.checked)}
                          size="small"
                        />
                      </ListItemIcon>
                      <ListItemText primary={modality} />
                    </ListItem>
                  ))}
                  {modalitySearch && filteredModalities.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No matching modalities" />
                    </ListItem>
                  )}
                </List>
              </Box>
              
              {availableFilters.modalities.length > MAX_VISIBLE_ITEMS && !modalitySearch && (
                <Typography variant="caption" color="text.secondary">
                  Showing {MAX_VISIBLE_ITEMS} of {availableFilters.modalities.length} modalities. Use search to find more.
                </Typography>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'area'} 
          onChange={handleAccordionChange('area')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">
              Area {filters.areas.length > 0 && `(${filters.areas.length})`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              <TextField
                placeholder="Search areas..."
                value={areaSearch}
                onChange={(e) => setAreaSearch(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                <List dense disablePadding>
                  {filteredAreas.map((area) => (
                    <ListItem key={area} dense disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox 
                          edge="start"
                          checked={filters.areas.includes(area)}
                          onChange={(e) => handleFilterChange('areas', area, e.target.checked)}
                          size="small"
                        />
                      </ListItemIcon>
                      <ListItemText primary={area} />
                    </ListItem>
                  ))}
                  {areaSearch && filteredAreas.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No matching areas" />
                    </ListItem>
                  )}
                </List>
              </Box>
              
              {availableFilters.areas.length > MAX_VISIBLE_ITEMS && !areaSearch && (
                <Typography variant="caption" color="text.secondary">
                  Showing {MAX_VISIBLE_ITEMS} of {availableFilters.areas.length} areas. Use search to find more.
                </Typography>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'year'} 
          onChange={handleAccordionChange('year')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">
              Year Published {filters.years.length > 0 && `(${filters.years.length})`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                multiple
                value={filters.years}
                onChange={handleYearChange}
                input={<OutlinedInput label="Year" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 224,
                    },
                  },
                }}
              >
                {availableFilters.years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Paper>
  );
};

export default React.memo(FilterPanel);
