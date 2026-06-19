import { Box, Chip } from '@mui/material';
import { PALETTE } from '../constants/theme';

type FormatFilterProps = {
  formats: string[];
  selectedFormat: string;
  onSelectFormat: (format: string) => void;
};

export const FormatFilter = ({ formats, selectedFormat, onSelectFormat }: FormatFilterProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
      <Chip
        label="Todos los Formatos"
        clickable
        onClick={() => onSelectFormat('ALL')}
        sx={{
          backgroundColor: selectedFormat === 'ALL' ? PALETTE.primary : PALETTE.surface,
          color: PALETTE.textMain,
          border: `1px solid ${PALETTE.border}`,
          '&:hover': { backgroundColor: PALETTE.primary }
        }}
      />
      {formats.map((format) => (
        <Chip
          key={format}
          label={format}
          clickable
          onClick={() => onSelectFormat(format)}
          sx={{
            backgroundColor: selectedFormat === format ? PALETTE.primary : PALETTE.surface,
            color: PALETTE.textMain,
            border: `1px solid ${PALETTE.border}`,
            '&:hover': { backgroundColor: PALETTE.primary }
          }}
        />
      ))}
    </Box>
  );
};