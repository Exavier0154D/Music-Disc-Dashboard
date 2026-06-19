import { Paper, Typography, Box } from '@mui/material';
import { PALETTE } from '../constants/theme';
import type { JSX } from 'react/jsx-runtime';

type KpiCardProps = {
  title: string;
  value: string | number;
  icon: JSX.Element;
  color: string;
};

export const KpiCard = ({ title, value, icon, color }: KpiCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: PALETTE.surface,
        border: `1px solid ${PALETTE.border}`,
        borderLeft: `5px solid ${color}`,
        borderRadius: 3,
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 6px 20px ${color}15`,
        }
      }}
    >
      <Box>
        <Typography variant="caption" sx={{ color: PALETTE.textMuted, display: 'block', mb: 0.5, fontWeight: 'medium', letterSpacing: '0.5px' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color: PALETTE.textMain, fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
      <Box 
        sx={{ 
          color: color, 
          display: 'flex', 
          alignItems: 'center',
          '& svg': { fontSize: 32 } 
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
};