import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
// use Box for layout to avoid Stack typing overload issues

import MusicNoteIcon from '@mui/icons-material/MusicNote';

export default function Header() {
  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <MusicNoteIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>Music Industry Sales Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">RIAA · Estados Unidos · 1973 – 2019</Typography>
        </Box>
      </Box>
      <Stack direction="row" spacing={1}>
        <Chip label="Ingresos" color="primary" size="small" />
        <Chip label="Unidades" variant="outlined" size="small" />
      </Stack>
    </Box>
  );
}