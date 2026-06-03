import { Box, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useState } from 'react';

const formats = ['Streaming', 'CD', 'Descarga digital', 'Vinilo', 'Cassette', 'Otros'];

export default function Selector() {
  const [metric, setMetric] = useState('revenue');
  const [period, setPeriod] = useState('all');
  const [selected, setSelected] = useState(['Streaming', 'CD', 'Descarga digital', 'Vinilo']);

  const toggle = (f: string) =>
    setSelected(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, boxShadow: 1, height: '100%' }}>
      <Typography variant="overline" color="text.secondary">Filtros</Typography>

      <FormControl fullWidth size="small" sx={{ mt: 1.5, mb: 2 }}>
        <InputLabel>Métrica</InputLabel>
        <Select value={metric} label="Métrica" onChange={e => setMetric(e.target.value)}>
          <MenuItem value="revenue">Ingresos (USD millones)</MenuItem>
          <MenuItem value="units">Unidades vendidas</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Período</InputLabel>
        <Select value={period} label="Período" onChange={e => setPeriod(e.target.value)}>
          <MenuItem value="all">1973 – 2019</MenuItem>
          <MenuItem value="2000">2000 – 2019</MenuItem>
          <MenuItem value="2010">2010 – 2019</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="caption" color="text.secondary">Formatos</Typography>
      <FormGroup sx={{ mt: 0.5 }}>
        {formats.map(f => (
          <FormControlLabel
            key={f}
            control={<Checkbox checked={selected.includes(f)} onChange={() => toggle(f)} size="small" />}
            label={<Typography variant="body2">{f}</Typography>}
          />
        ))}
      </FormGroup>
    </Box>
  );
}