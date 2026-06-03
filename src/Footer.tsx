import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, boxShadow: 1, textAlign: 'center' }}>
      <Typography variant="caption" color="text.secondary">
        Fuente: RIAA (Recording Industry Association of America) · Dataset:{' '}
        <a href="https://www.kaggle.com/datasets/imtkaggleteam/40-years-of-music-industry-sales" target="_blank" rel="noreferrer">
          40 Years of Music Industry Sales
        </a>{' '}
        · Valores en dólares (wholesale revenue, inflation-adjusted)
      </Typography>
    </Box>
  );
}