import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@mui/material/styles';

export const SidebarMenu = ({
  items,  
  open,
  openMenus,
  setOpenMenus,
  anchorElVentas,
  anchorElCotizacion,
  setAnchorElVentas,
  setAnchorElCotizacion,
  setMobileOpen,
  isMobile = false
}) => {
  const location = useLocation();
  const theme = useTheme();

  const toggleSubmenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmenuClick = (event, key) => {
    if (open || isMobile) {
      toggleSubmenu(key);
      return;
    }

    if (key === 'ventas') setAnchorElVentas(event.currentTarget);
    if (key === 'cotizacion') setAnchorElCotizacion(event.currentTarget);
  };

  const handleCloseMenu = (key) => {
    if (key === 'ventas') setAnchorElVentas(null);
    if (key === 'cotizacion') setAnchorElCotizacion(null);
  };

  const handleItemClick = () => {
    if (isMobile && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const getButtonStyles = (isActive, isSubItem = false) => ({
    minHeight: 48,
    px: 2.5,
    pl: isSubItem ? 4 : 2.5,
    justifyContent: (open || isMobile) ? 'initial' : 'center',
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    backgroundColor: isActive ? 'primary.main' : 'transparent',
    color: isActive ? '#fff' : theme.palette.text.primary,
    '&:hover': {
      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
    },
  });

  const getIconStyles = (isActive) => ({
    minWidth: 0,
    justifyContent: 'center',
    mr: (open || isMobile) ? 3 : 'auto',
    color: isActive ? '#fff' : theme.palette.text.primary,
  });

  const textStyles = {
    opacity: (open || isMobile) ? 1 : 0,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List sx={{ flex: 1, mt: 1 }}>
        {items.map((item, index) => {
          if (item.type === 'divider') {
            return <Divider key={index} sx={{ my: 1 }} />;
          }

          if (item.type === 'item') {
            const isActive = location.pathname === item.to;

            return (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <Tooltip title={(!open && !isMobile) ? item.text : ''} placement="right" arrow>
                  <ListItemButton 
                    component={NavLink} 
                    to={item.to} 
                    sx={getButtonStyles(isActive)}
                    onClick={handleItemClick}
                  >
                    <ListItemIcon sx={getIconStyles(isActive)}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} sx={textStyles} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          }

          if (item.type === 'submenu') {
            const isSubmenuActive = item.children.some((child) => location.pathname === child.to);
            const anchorEl = item.key === 'ventas' ? anchorElVentas : anchorElCotizacion;

            return (
              <React.Fragment key={item.key}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <Tooltip title={(!open && !isMobile) ? item.text : ''} placement="right" arrow>
                    <ListItemButton
                      onClick={(event) => handleSubmenuClick(event, item.key)}
                      sx={getButtonStyles(isSubmenuActive)}
                    >
                      <ListItemIcon sx={getIconStyles(isSubmenuActive)}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} sx={textStyles} />
                      {(open || isMobile) && (
                        openMenus[item.key] ? <ExpandLess /> : <ExpandMore />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>

                <Collapse in={openMenus[item.key]} timeout="auto" unmountOnExit>
                  {(open || isMobile) && (
                    <List component="div" disablePadding>
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.to;

                        return (
                          <ListItem key={child.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                              component={NavLink}
                              to={child.to}
                              sx={getButtonStyles(isChildActive, true)}
                              onClick={handleItemClick}
                            >
                              <ListItemIcon sx={getIconStyles(isChildActive)}>
                                {child.icon}
                              </ListItemIcon>
                              <ListItemText primary={child.text} sx={textStyles} />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  )}
                </Collapse>

                {/* Menú flotante para desktop cuando está cerrado */}
                {!open && !isMobile && (
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => handleCloseMenu(item.key)}
                  >
                    {item.children.map((child) => (
                      <MenuItem
                        key={child.text}
                        component={NavLink}
                        to={child.to}
                        onClick={() => handleCloseMenu(item.key)}
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText>{child.text}</ListItemText>
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </React.Fragment>
            );
          }

          return null;
        })}
      </List>

      {/* Botón de tema al final del sidebar */}
      <Box sx={{ mb: 2 }}>
        <Divider sx={{ my: 1 }} />  
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ThemeToggle isSidebarOpen={open || isMobile} />
        </ListItem>
      </Box>
    </Box>
  );
};