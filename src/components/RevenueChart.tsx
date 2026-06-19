import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PALETTE } from '../constants/theme';

type RevenueChartProps = {
  data: Record<string, string | number>[];
  dataKeys: string[];
};

const DYNAMIC_COLORS = [
  '#00E5FF', '#FF007F', '#7000FF', '#39FF14', 
  '#FFD700', '#FF5722', '#00FFFF', '#E91E63'
];

export const RevenueChart = ({ data, dataKeys }: RevenueChartProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: PALETTE.surface,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 4,
        p: 3,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }
      }}
    >
      <Typography variant="subtitle1" sx={{ color: PALETTE.textMain, mb: 2, fontWeight: 'bold' }}>
        Mezclador de Tendencias e Ingresos por Año (Billones USD)
      </Typography>
      <Box sx={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
            <XAxis dataKey="year" stroke={PALETTE.textMuted} style={{ fontSize: '12px' }} />
            <YAxis stroke={PALETTE.textMuted} style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111625', borderColor: PALETTE.border, color: PALETTE.textMain, borderRadius: '12px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '15px' }} />
            {dataKeys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={key === 'Todos los Formatos' ? PALETTE.primary : DYNAMIC_COLORS[index % DYNAMIC_COLORS.length]} 
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};