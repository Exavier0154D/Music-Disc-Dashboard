import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';

const rows = [
  { rank: 1, format: 'CD',              total: '$218B', period: '1983–2019', status: 'declive',  color: 'error'   },
  { rank: 2, format: 'Streaming',       total: '$48B',  period: '2005–2019', status: 'activo',   color: 'success' },
  { rank: 3, format: 'Descarga digital',total: '$32B',  period: '2004–2019', status: 'bajando',  color: 'warning' },
  { rank: 4, format: 'Cassette',        total: '$29B',  period: '1973–2001', status: 'extinto',  color: 'default' },
  { rank: 5, format: 'Vinilo LP',       total: '$21B',  period: '1973–2019', status: 'resurge',  color: 'success' },
];

export default function FormatsTable() {
  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, boxShadow: 1 }}>
      <Typography variant="overline" color="text.secondary">Top formatos por ingreso total</Typography>
      <Table size="small" sx={{ mt: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Formato</TableCell>
            <TableCell>Total USD</TableCell>
            <TableCell>Período</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(r => (
            <TableRow key={r.rank}>
              <TableCell sx={{ fontWeight: 600 }}>{r.rank}</TableCell>
              <TableCell>{r.format}</TableCell>
              <TableCell>{r.total}</TableCell>
              <TableCell sx={{ fontSize: 11 }}>{r.period}</TableCell>
              <TableCell>
                <Chip label={r.status} color={r.color as any} size="small" sx={{ fontSize: 10 }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}