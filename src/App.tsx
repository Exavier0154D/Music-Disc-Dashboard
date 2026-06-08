import { Grid } from '@mui/material';
import Header from './Header';
import Alerts from './Alerts';
import Selector from './Selector';
import Indicators from './Indicators';
import SalesChart from './SalesChart';
import FormatsTable from './FormatsTable';
import Footer from './Footer';
import './App.css';

function App() {
  return (
    <Grid
      container
      spacing={3}
      sx={{
        justifyContent: 'center',
        alignItems: 'flex-start',
        p: { xs: 2, md: 3 },
        background: 'radial-gradient(circle at center, #121620 0%, #07090e 100%)',
        minHeight: '100vh',
        color: '#a0aec0',
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <Grid size={{ xs: 12, md: 12 }}>
        <Header />
      </Grid>

      <Grid size={{ xs: 12, md: 12 }}>
        <Alerts />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Selector />
      </Grid>

      <Grid size={{ xs: 12, md: 9 }}>
        <Indicators />
      </Grid>

      <Grid
        size={{ xs: 12, md: 7 }}
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        <SalesChart />
      </Grid>

      <Grid
        size={{ xs: 12, md: 5 }}
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        <FormatsTable />
      </Grid>

      <Grid size={{ xs: 12, md: 12 }}>
        <Footer />
      </Grid>
    </Grid>
  );
}

export default App;