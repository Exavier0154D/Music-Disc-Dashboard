// src/App.tsx
import { Grid } from '@mui/material';
import Header from './Header';
import Alerts from './Alerts';
import Selector from './Selector';
import Indicators from './Indicators';
import SalesChart from './SalesChart';
import FormatsTable from './FormatsTable';
import Footer from './Footer';

function App() {
  return (
    <Grid
      container
      spacing={3}
      sx={{ justifyContent: 'center', alignItems: 'flex-start', p: 2, backgroundColor: '#f5f5f5', minHeight: '100vh' }}
    >
      {/* Encabezado */}
      <Grid size={{ xs: 12, md: 12 }}>
        <Header />
      </Grid>

      {/* Alertas */}
      <Grid size={{ xs: 12, md: 12 }}>
        <Alerts />
      </Grid>

      {/* Selector */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Selector />
      </Grid>

      {/* Indicadores */}
      <Grid size={{ xs: 12, md: 9 }}>
        <Indicators />
      </Grid>

      {/* Gráfico */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        <SalesChart />
      </Grid>

      {/* Tabla */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        <FormatsTable />
      </Grid>

      {/* Información adicional */}
      <Grid size={{ xs: 12, md: 12 }}>
        <Footer />
      </Grid>
    </Grid>
  );
}

export default App;