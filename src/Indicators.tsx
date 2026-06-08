import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const kpis = [
  { label: 'Pico de ingresos', value: '$21.5B', sub: 'Año 1999 (era CD)', color: '#00f2fe' },
  { label: 'Ingresos 2019', value: '$11.1B', sub: '+79% vs. 2015', color: '#ff9f43' },
  { label: 'Formatos activos', value: '12', sub: 'A lo largo del período', color: '#a0aec0' },
  { label: 'Streaming 2019', value: '$8.8B', sub: '79% del total', color: '#10ac84' },
  { label: 'Vinilo 2019', value: '$504M', sub: 'Récord desde los 80s', color: '#ee5253' },
  { label: 'Años de datos', value: '47', sub: '1973 – 2019', color: '#a0aec0' },
];

export default function Indicators() {
  return (
    <Grid container spacing={2}>
      {kpis.map((k, i) => (
        <Grid size={{ xs: 6, sm: 4 }} key={i}>
          <Box
            sx={{
              backgroundColor: '#0f131a',
              border: '1px solid #232d3f',
              borderRadius: 2,
              p: 2,
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.8)',
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: '#718096',
                fontFamily: 'inherit',
                display: 'block',
              }}
            >
              {k.label}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 0.5,
                fontWeight: 'bold',
                color: k.color,
                textShadow: `0 0 10px ${k.color}80`,
                fontFamily: 'inherit',
              }}
            >
              {k.value}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: '#e2e8f0',
                fontFamily: 'inherit',
              }}
            >
              {k.sub}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}