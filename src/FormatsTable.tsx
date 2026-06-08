import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';

const rows = [
  { rank: 1, format: 'CD',              total: '$218B', period: '1983–2019', status: 'declive',  color: '#ee5253' },
  { rank: 2, format: 'Streaming',       total: '$48B',  period: '2005–2019', status: 'activo',   color: '#10ac84' },
  { rank: 3, format: 'Descarga digital',total: '$32B',  period: '2004–2019', status: 'bajando',  color: '#ff9f43' },
  { rank: 4, format: 'Cassette',        total: '$29B',  period: '1973–2001', status: 'extinto',  color: '#718096' },
  { rank: 5, format: 'Vinilo LP',       total: '$21B',  period: '1973–2019', status: 'resurge',  color: '#10ac84' },
];

export default function FormatsTable() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(145deg, #141923, #1a212e)',
        border: '1px solid #2d3748',
        borderRadius: 2,
        p: 2,
        boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.05), 0 10px 25px rgba(0, 0, 0, 0.6)',
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <Typography
        variant="overline"
        sx={{
          color: '#00f2fe',
          fontWeight: 'bold',
          letterSpacing: 1,
          fontFamily: 'inherit',
          display: 'block',
          mb: 1,
        }}
      >
        MASTER FORMATS CONTROL
      </Typography>
      
      <Table
        size="small"
        sx={{
          '& .MuiTableCell-root': {
            fontFamily: 'inherit',
            borderBottom: '1px solid #1a212e',
            color: '#a0aec0',
          },
        }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: '#111622' }}>
            <TableCell sx={{ color: '#00f2fe', fontWeight: 'bold', borderBottom: '2px solid #232d3f' }}>#</TableCell>
            <TableCell sx={{ color: '#00f2fe', fontWeight: 'bold', borderBottom: '2px solid #232d3f' }}>Formato</TableCell>
            <TableCell sx={{ color: '#00f2fe', fontWeight: 'bold', borderBottom: '2px solid #232d3f' }}>Total USD</TableCell>
            <TableCell sx={{ color: '#00f2fe', fontWeight: 'bold', borderBottom: '2px solid #232d3f' }}>Período</TableCell>
            <TableCell sx={{ color: '#00f2fe', fontWeight: 'bold', borderBottom: '2px solid #232d3f' }}>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(r => (
            <TableRow key={r.rank} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ fontWeight: 600, color: '#e2e8f0' }}>{r.rank}</TableCell>
              <TableCell>{r.format}</TableCell>
              <TableCell>{r.total}</TableCell>
              <TableCell sx={{ fontSize: 11 }}>{r.period}</TableCell>
              <TableCell>
                <Chip
                  label={`● ${r.status.toUpperCase()}`}
                  size="small"
                  sx={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    backgroundColor: '#0f131a',
                    color: r.color,
                    border: `1px solid ${r.color}40`,
                    boxShadow: `inset 0 0 5px rgba(0,0,0,0.8), 0 0 8px ${r.color}40`,
                    letterSpacing: 0.5,
                    fontFamily: 'inherit',
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}