import { Alert, Stack } from '@mui/material';

const alerts = [
  { severity: 'info',    text: 'Streaming domina desde 2016 — representa el 80% de los ingresos en 2019.' },
  { severity: 'success', text: 'Vinilo en resurgimiento: crecimiento sostenido desde 2010.' },
  { severity: 'error',   text: 'CDs en declive desde 2000 — caída del 98% vs. su pico histórico.' },
  { severity: 'warning', text: 'Descarga digital reemplazada por streaming a partir de 2012.' },
];

export default function Alerts() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      {alerts.map((a, i) => (
        <Alert key={i} severity={a.severity as any} sx={{ flex: 1, fontSize: 12 }}>
          {a.text}
        </Alert>
      ))}
    </Stack>
  );
}