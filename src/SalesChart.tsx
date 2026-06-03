import { Box, Typography } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { year: 1980, Streaming: 0,   CD: 0,    Descarga: 0,   Vinilo: 2.1 },
  { year: 1990, Streaming: 0,   CD: 3.5,  Descarga: 0,   Vinilo: 0.5 },
  { year: 1999, Streaming: 0,   CD: 13.0, Descarga: 0,   Vinilo: 0.3 },
  { year: 2004, Streaming: 0,   CD: 9.2,  Descarga: 0.2, Vinilo: 0.2 },
  { year: 2008, Streaming: 0.3, CD: 7.4,  Descarga: 1.8, Vinilo: 0.2 },
  { year: 2012, Streaming: 1.8, CD: 5.8,  Descarga: 2.8, Vinilo: 0.4 },
  { year: 2016, Streaming: 4.8, CD: 3.2,  Descarga: 2.0, Vinilo: 0.5 },
  { year: 2019, Streaming: 8.8, CD: 1.4,  Descarga: 0.8, Vinilo: 0.5 },
];

const COLORS: Record<string, string> = {
  Streaming: '#1976d2',
  CD: '#757575',
  Descarga: '#388e3c',
  Vinilo: '#e64a19',
};

export default function SalesChart() {
  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, boxShadow: 1 }}>
      <Typography variant="overline" color="text.secondary">
        Ingresos por formato · 1973–2019
      </Typography>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => `$${v}B`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {Object.entries(COLORS).map(([key, color]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}