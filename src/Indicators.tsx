import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const kpis = [
  { label: 'Pico de ingresos', value: '$21.5B', sub: 'Año 1999 (era CD)' },
  { label: 'Ingresos 2019', value: '$11.1B', sub: '+79% vs. 2015' },
  { label: 'Formatos activos', value: '12', sub: 'A lo largo del período' },
  { label: 'Streaming 2019', value: '$8.8B', sub: '79% del total' },
  { label: 'Vinilo 2019', value: '$504M', sub: 'Récord desde los 80s' },
  { label: 'Años de datos', value: '47', sub: '1973 – 2019' },
];

export default function Indicators() {
  return (
    <Grid container spacing={2}>
      {kpis.map((k, i) => (
        <Grid size={{ xs: 6, sm: 4 }} key={i}>
          <Box
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {k.label}
            </Typography>

            <Typography
              variant="h5"
              sx={{ mt: 0.5, fontWeight: 500 }}
            >
              {k.value}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {k.sub}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}