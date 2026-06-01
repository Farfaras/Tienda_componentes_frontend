import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 340,
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(1),
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.22),
  },
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4.5)})`,
    width: '100%',
  },
}));

const SearchResults = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  width: '100%',
  maxHeight: 320,
  overflowY: 'auto',
  zIndex: theme.zIndex.modal + 1,
  borderRadius: 12,
}));

export const SearchBar = ({ items }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  const searchableItems = items.flatMap((item) => {
    if (item.type === 'item') {
      return [{ text: item.text, to: item.to, icon: item.icon, group: 'Menú' }];
    }

    if (item.type === 'submenu') {
      return item.children.map((child) => ({
        text: child.text,
        to: child.to,
        icon: child.icon,
        group: item.text,
      }));
    }

    return [];
  });

  const results = searchTerm.trim()
    ? searchableItems.filter((item) =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelect = (item) => {
    navigate(item.to);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setShowSearchResults(false)}>
      <SearchContainer>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>

          <StyledInputBase
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => {
              if (searchTerm.trim()) setShowSearchResults(true);
            }}
          />
        </Search>

        {showSearchResults && searchTerm.trim() && (
          <SearchResults elevation={6}>
            {results.length > 0 ? (
              <List sx={{ py: 1 }}>
                {results.map((item, index) => (
                  <ListItem key={`${item.text}-${index}`} disablePadding>
                    <ListItemButton onClick={() => handleSelect(item)}>
                      <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} secondary={item.group} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No se encontraron resultados
                </Typography>
              </Box>
            )}
          </SearchResults>
        )}
      </SearchContainer>
    </ClickAwayListener>
  );
};