import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import EqualizerIcon from '@mui/icons-material/Equalizer';

export const MusicStats = () => {
  const meanValue = 56.00;
  const varianceValue = 874.00;
  const stdDeviationValue = 29.56;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        backgroundColor: '#111625', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        borderRadius: 4, 
        p: 4, 
        mb: 4,
        width: '100%', 
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <EqualizerIcon sx={{ color: '#00E5FF', fontSize: 32 }} />
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Análisis Estadístico del Ecosistema de Audio
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12, sm: 4 }} sx={{ p: '0 !important', pr: { sm: 2 }, pb: { xs: 2, sm: 0 } }}>
          <Box 
            sx={{ 
              backgroundColor: '#0B0F19', 
              p: 3, 
              borderRadius: 3, 
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
              '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: '#00E5FF',
                boxShadow: '0 8px 25px rgba(0, 229, 255, 0.15)',
                backgroundColor: '#121829',
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
              Ganancia Media (μ)
            </Typography>
            <Typography variant="h4" sx={{ color: '#00E5FF', fontWeight: 'bold' }}>
              {meanValue.toFixed(2)} dB
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }} sx={{ p: '0 !important', px: { sm: 1 }, pb: { xs: 2, sm: 0 } }}>
          <Box 
            sx={{ 
              backgroundColor: '#0B0F19', 
              p: 3, 
              borderRadius: 3, 
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
              '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: '#7000FF',
                boxShadow: '0 8px 25px rgba(112, 0, 255, 0.15)',
                backgroundColor: '#121829',
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
              Varianza de Mercado (σ²)
            </Typography>
            <Typography variant="h4" sx={{ color: '#7000FF', fontWeight: 'bold' }}>
              {varianceValue.toFixed(2)}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }} sx={{ p: '0 !important', pl: { sm: 2 } }}>
          <Box 
            sx={{ 
              backgroundColor: '#0B0F19', 
              p: 3, 
              borderRadius: 3, 
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
              '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: '#FF007F',
                boxShadow: '0 8px 25px rgba(255, 0, 127, 0.15)',
                backgroundColor: '#121829',
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
              Desviación Estándar (σ)
            </Typography>
            <Typography variant="h4" sx={{ color: '#FF007F', fontWeight: 'bold' }}>
              {stdDeviationValue.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};