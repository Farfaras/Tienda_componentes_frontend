import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Box, 
  Chip,
  Button,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

export const DataTableSearch = ({ 
  onSearch, 
  placeholder = "Buscar...",
  searchFields = [],
  delay = 300
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const filtersString = JSON.stringify(activeFilters);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchTerm, activeFilters);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, filtersString, delay]);

  const handleClear = () => {
    setSearchTerm('');
    setActiveFilters([]);
    onSearch?.('', []);
  };

  const handleFilterToggle = () => {
    setShowFilters(prev => !prev);
  };

  const addFilter = (field) => {
    if (!activeFilters.includes(field)) {
      setActiveFilters([...activeFilters, field]);
    }
  };

  const removeFilter = (field) => {
    setActiveFilters(activeFilters.filter(f => f !== field));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  return (
    <Box sx={{ width: '100%' }}>  {/* 👈 Asegura que ocupe todo el ancho disponible */}
      
      {/* TOOLBAR RESPONSIVO */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',  // 👈 Siempre en fila
          alignItems: 'center',
          gap: 1,
          width: '100%',
        }}
      >
        {/* INPUT - Ocupa todo el espacio disponible */}
        <TextField
          size="small"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flex: 1,  // 👈 Ocupa todo el espacio disponible
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.paper,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* BOTÓN DE FILTROS - Tamaño fijo */}
        {searchFields.length > 0 && (
          <Tooltip title="Filtros">
            <IconButton
              onClick={handleFilterToggle}
              size="small"
              sx={{
                flexShrink: 0,  // 👈 Evita que se encoja
                backgroundColor: showFilters
                  ? 'rgba(25,118,210,0.1)'
                  : 'transparent',
              }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* PANEL DE FILTROS */}
      {showFilters && searchFields.length > 0 && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            bgcolor: 'action.hover',
            borderRadius: 1,
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: 1,
              mb: 1,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Filtrar por:
            </Typography>

            {activeFilters.length > 0 && (
              <Button size="small" onClick={clearAllFilters}>
                Limpiar
              </Button>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            {searchFields.map((field) => (
              <Chip
                key={field.value}
                label={field.label}
                onClick={() => addFilter(field.value)}
                size="small"
                color={activeFilters.includes(field.value) ? 'primary' : 'default'}
                variant={activeFilters.includes(field.value) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>

          {activeFilters.length > 0 && (
            <Box
              sx={{
                mt: 1.5,
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Activos:
              </Typography>

              {activeFilters.map((filter) => (
                <Chip
                  key={filter}
                  label={searchFields.find(f => f.value === filter)?.label || filter}
                  onDelete={() => removeFilter(filter)}
                  size="small"
                  deleteIcon={<CloseIcon />}
                  color="primary"
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};