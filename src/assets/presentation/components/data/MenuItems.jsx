import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import DescriptionIcon from '@mui/icons-material/Description';
import CancelIcon from '@mui/icons-material/Cancel';

export const MenuItems = [
  { type: 'item', text: 'Inicio', to: '/', icon: <HomeIcon /> },
  { type: 'item', text: 'Usuarios', to: '/usuarios', icon: <PeopleIcon /> },
  { type: 'item', text: 'Clientes', to: '/clientes', icon: <PersonIcon /> },

  { type: 'divider' },

  { type: 'item', text: 'Productos', to: '/productos', icon: <Inventory2Icon /> },
  { type: 'item', text: 'Categorias', to: '/categorias', icon: <CategoryIcon /> },
  { type: 'item', text: 'Marcas', to: '/marcas', icon: <BrandingWatermarkIcon /> },

  { type: 'divider' },

  {
    type: 'submenu',
    key: 'ventas',
    text: 'Ventas',
    icon: <PointOfSaleIcon />,
    children: [
      { text: 'Generar Venta', to: '/ventas/generar', icon: <ReceiptLongIcon /> },
      { text: 'Reporte de Ventas', to: '/ventas/reporte', icon: <AssessmentIcon /> },
      { text: 'Reporte de Anulados', to: '/ventas/anuladas', icon: <MoneyOffIcon /> },
    ],
  },

  { type: 'divider' },

  {
    type: 'submenu',
    key: 'cotizacion',
    text: 'Cotización',
    icon: <RequestQuoteIcon />,
    children: [
      { text: 'Generar Cotización', to: '/cotizacion/generar', icon: <DescriptionIcon /> },
      { text: 'Reporte de Cotización', to: '/cotizacion/reporte', icon: <AssessmentIcon /> },
      { text: 'Reporte de Anulados', to: '/cotizacion/anuladas', icon: <CancelIcon /> },
    ],
  },
];