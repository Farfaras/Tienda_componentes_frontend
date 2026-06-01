import React, { useState, useEffect, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableSortLabel,
  TablePagination,
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataTableSearch } from './DataTableSearch';

export const DataTable = ({ 
  columns, 
  rows, 
  initialRowsPerPage = 5,
  showRefresh = false,
  onRefresh,
  searchable = true,
  searchPlaceholder = "Buscar...",
  searchFields = []
}) => {
  const theme = useTheme();

  // 📱 Detectar si es móvil
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  // ===============================
// FILTRADO
// ===============================
const filteredRows = useMemo(() => {
  if (!searchTerm && activeFilters.length === 0) {
    return rows;
  }

  return rows.filter((row) => {
    let fieldsToSearch =
      searchFields.length > 0
        ? searchFields.map((f) => f.value)
        : columns
            .filter((col) => col.searchable !== false)
            .map((col) => col.field);

    if (activeFilters.length > 0) {
      fieldsToSearch = activeFilters;
    }

    return fieldsToSearch.some((field) => {
      const value = row[field];

      if (value === null || value === undefined) {
        return false;
      }

      return String(value)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  });
}, [rows, searchTerm, activeFilters, columns, searchFields]);

// ===============================
// ORDENAMIENTO
// ===============================
const sortedRows = useMemo(() => {
  if (!orderBy) {
    return filteredRows;
  }

  return [...filteredRows].sort((a, b) => {
    const aValue = a[orderBy] ?? '';
    const bValue = b[orderBy] ?? '';

    if (
      typeof aValue === 'number' &&
      typeof bValue === 'number'
    ) {
      return order === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }

    const comparison = String(aValue).localeCompare(
      String(bValue)
    );

    return order === 'asc'
      ? comparison
      : -comparison;
  });
}, [filteredRows, orderBy, order]);

// ===============================
// TOTAL
// ===============================
const totalCount = sortedRows.length;

// ===============================
// PAGINACIÓN SEGURA
// ===============================
const safePage = useMemo(() => {
  const maxPage = Math.max(
    0,
    Math.ceil(totalCount / rowsPerPage) - 1
  );

  return page > maxPage ? 0 : page;
}, [page, totalCount, rowsPerPage]);

// ===============================
// FILAS PAGINADAS
// ===============================
const paginatedRows = useMemo(() => {
  if (rowsPerPage === -1) {
    return sortedRows;
  }

  const start = safePage * rowsPerPage;
  const end = start + rowsPerPage;

  return sortedRows.slice(start, end);
}, [sortedRows, safePage, rowsPerPage]);

// ===============================
// SORT
// ===============================
const handleSort = (property) => {
  const isAsc =
    orderBy === property && order === 'asc';

  setOrder(isAsc ? 'desc' : 'asc');
  setOrderBy(property);
};

// ===============================
// PAGINACIÓN
// ===============================
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

// ===============================
// FILAS POR PÁGINA
// ===============================
const handleChangeRowsPerPage = (event) => {
  const newRowsPerPage = parseInt(
    event.target.value,
    10
  );

  setRowsPerPage(newRowsPerPage);
  setPage(0);
};

// ===============================
// SEARCH
// ===============================
const handleSearch = React.useCallback((term, filters) => {
  const sameSearch = term === searchTerm;

  const sameFilters =
    JSON.stringify(filters) ===
    JSON.stringify(activeFilters);

  // Evitar renders innecesarios
  if (sameSearch && sameFilters) {
    return;
  }

  setSearchTerm(term);
  setActiveFilters(filters);
  setPage(0);
}, [searchTerm, activeFilters]);

const searchFieldsConfig = searchFields.length > 0
  ? searchFields
  : columns
      .filter(
        (col) =>
          col.searchable !== false &&
          col.field !== 'accion'
      )
      .map((col) => ({
        value: col.field,
        label: col.headerName,
      }));

const headerFooterBgColor =
  theme.palette.mode === 'light'
    ? theme.palette.background.paper
    : theme.palette.background.default;

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        boxShadow: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* TOOLBAR */}
      {(searchable || showRefresh) && (
        <Box 
          sx={{ 
            p: 2, 
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: headerFooterBgColor,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2,
              alignItems: isMobile ? 'stretch' : 'flex-start',
            }}
          >
            {searchable && (
              <Box sx={{ flex: 1 }}>
                <DataTableSearch
                  onSearch={handleSearch}
                  placeholder={searchPlaceholder}
                  searchFields={searchFieldsConfig}
                  delay={300}
                />
              </Box>
            )}

            {showRefresh && (
              <Box sx={{ alignSelf: isMobile ? 'flex-end' : 'flex-start' }}>
                <Tooltip title="Actualizar datos">
                  <IconButton onClick={onRefresh}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {searchTerm && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              Mostrando {filteredRows.length} de {rows.length}
            </Typography>
          )}
        </Box>
      )}

      {/* TABLA CONTAINER */}
      <TableContainer 
        sx={{
          maxHeight: rowsPerPage > 5 ? 650 : 400,
          overflowY: 'auto',
          overflowX: isMobile ? 'auto' : 'visible',
        }}
      >
        <Table 
          stickyHeader 
          size={isMobile ? 'small' : 'medium'}
          sx={{
            ...(!isMobile && {
              minWidth: '100%',
              width: '100%',
              tableLayout: 'fixed',
            }),
          }}
        >
          {/* HEADER */}
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    ...(isMobile && {
                      whiteSpace: 'nowrap',
                      minWidth: col.width || 100,
                    }),
                    backgroundColor: headerFooterBgColor,
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                    fontSize: isMobile ? '0.75rem' : '0.9rem',
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    '&:last-child': {
                      borderRight: 'none',
                    },
                  }}
                >
                  <TableSortLabel
                    active={orderBy === col.field}
                    direction={orderBy === col.field ? order : 'asc'}
                    onClick={() => handleSort(col.field)}
                    hideSortIcon={false}
                    sx={{
                      '&&': { color: theme.palette.text.primary },
                      '&& .MuiTableSortLabel-icon': {
                        opacity: 1,
                        color: theme.palette.text.primary,
                      },
                    }}
                  >
                    {col.headerName}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* BODY */}
          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <TableRow
                hover
                key={row.id}
                sx={{
                  backgroundColor: theme.palette.mode === 'light'
                    ? (rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc')
                    : (rowIndex % 2 === 0 ? theme.palette.background.paper : '#1e293b'),
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? '#e0edff'
                      : 'rgba(59, 130, 246, 0.2)',
                  },
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{
                      ...(isMobile && {
                        whiteSpace: 'nowrap',
                      }),
                      fontSize: isMobile ? '0.75rem' : '0.9rem',
                      padding: isMobile ? '8px' : '12px 16px',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      borderRight: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.primary,
                      '&:last-child': {
                        borderRight: 'none',
                      },
                    }}
                  >
                    {col.renderCell ? col.renderCell(row) : row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {paginatedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography>No hay datos</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINACIÓN */}
      <TablePagination
        rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={safePage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={isMobile ? '' : 'Filas por página'}
        sx={{
          fontSize: isMobile ? '0.75rem' : '0.9rem',
          backgroundColor: headerFooterBgColor,
          borderTop: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          '& .MuiTablePagination-actions': {
            color: theme.palette.text.primary,
          },
          '& .MuiSelect-icon': {
            color: theme.palette.text.primary,
          },
          '& .MuiIconButton-root': {
            color: theme.palette.text.primary,
          },
        }}
      />
    </Paper>
  );
};