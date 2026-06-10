import {
  Grid as Grid,
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  Slider,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AlbumIcon from '@mui/icons-material/Album';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
 
// ─── Theme tokens ──────────────────────────────────────────────────────────────
const BG_DARK = '#16181d';
const SURFACE = '#1e2128';
const SURFACE_RAISED = '#252830';
const BORDER = '#333844';
const TEXT_PRIMARY = '#e8eaf0';
const TEXT_MUTED = '#7a8299';
 
const C_STREAMING = '#4f8ef7';
const C_CD = '#a855f7';
const C_CASSETTE = '#f59e0b';
const C_VINYL = '#10b981';
const C_DOWNLOAD = '#ef4444';
const C_OTHER = '#64748b';
 
const ACCENT_TEAL = '#2dd4bf';
const ACCENT_PINK = '#f472b6';
 
// ─── Types ─────────────────────────────────────────────────────────────────────
type MusicRecord = {
  Format: string;
  Metric: string;
  Year: number;
  'Value(Actual)': number;
};
 
type YearlyRow = {
  year: string;
  vinyl: number;
  cassette: number;
  cd: number;
  download: number;
  streaming: number;
};
 
type VinylRow = { year: string; units: number };
type StreamRow = { year: string; rev: number };
 
// ─── Data transformation helpers ──────────────────────────────────────────────
function buildYearlyData(records: MusicRecord[]): YearlyRow[] {
  const adjusted = records.filter(r => r.Metric === 'Value (Adjusted)');
  const byYear: Record<number, YearlyRow> = {};
 
  const formatKey: Record<string, keyof Omit<YearlyRow, 'year'>> = {
    'Streaming': 'streaming',
    'Downloaded Music': 'download',
    'CD': 'cd',
    'Cassette': 'cassette',
    'Vinyl': 'vinyl',
    'LP/EP': 'vinyl',
  };
 
  adjusted.forEach(r => {
    if (!byYear[r.Year]) {
      byYear[r.Year] = { year: String(r.Year), vinyl: 0, cassette: 0, cd: 0, download: 0, streaming: 0 };
    }
    const key = formatKey[r.Format];
    if (key) {
      byYear[r.Year][key] += (r['Value(Actual)'] ?? 0) / 1000;
    }
  });
 
  return Object.values(byYear)
    .sort((a, b) => Number(a.year) - Number(b.year))
    .filter(r => Number(r.year) % 2 === 1 || Number(r.year) >= 2020);
}
 
function buildVinylRevival(records: MusicRecord[]): VinylRow[] {
  const vinylUnits = records.filter(
    r => (r.Format === 'Vinyl' || r.Format === 'LP/EP') &&
         r.Metric === 'Units' &&
         r.Year >= 2008
  );
  const byYear: Record<number, number> = {};
  vinylUnits.forEach(r => {
    byYear[r.Year] = (byYear[r.Year] ?? 0) + (r['Value(Actual)'] ?? 0) / 1000000;
  });
  return Object.entries(byYear)
    .map(([year, units]) => ({ year, units: Math.round(units * 10) / 10 }))
    .sort((a, b) => Number(a.year) - Number(b.year));
}
 
function buildStreamingGrowth(records: MusicRecord[]): StreamRow[] {
  const streaming = records.filter(
    r => r.Format === 'Streaming' &&
         r.Metric === 'Value (Adjusted)' &&
         r.Year >= 2010
  );
  const byYear: Record<number, number> = {};
  streaming.forEach(r => {
    byYear[r.Year] = (byYear[r.Year] ?? 0) + (r['Value(Actual)'] ?? 0) / 1000;
  });
  return Object.entries(byYear)
    .map(([year, rev]) => ({ year, rev: Math.round(rev * 10) / 10 }))
    .sort((a, b) => Number(a.year) - Number(b.year));
}
 
function buildShare2022(records: MusicRecord[]) {
  const year2022 = records.filter(r => r.Year === 2022 && r.Metric === 'Value (Adjusted)');
  const totals: Record<string, number> = {};
  year2022.forEach(r => {
    totals[r.Format] = (totals[r.Format] ?? 0) + (r['Value(Actual)'] ?? 0);
  });
  const total = Object.values(totals).reduce((s, v) => s + v, 0);
  const colorMap: Record<string, string> = {
    'Streaming': C_STREAMING,
    'Vinyl': C_VINYL,
    'LP/EP': C_VINYL,
    'Downloaded Music': C_DOWNLOAD,
    'CD': C_CD,
  };
  const items = Object.entries(totals).map(([name, val]) => ({
    name,
    value: Math.round((val / total) * 100),
    color: colorMap[name] ?? C_OTHER,
  }));
  items.sort((a, b) => b.value - a.value);
  const main = items.filter(i => i.value >= 2);
  const otherVal = items.filter(i => i.value < 2).reduce((s, i) => s + i.value, 0);
  if (otherVal > 0) main.push({ name: 'Other', value: otherVal, color: C_OTHER });
  return main;
}
 
// ─── Static fallback data (used while loading) ────────────────────────────────
const FALLBACK_YEARLY: YearlyRow[] = [
  { year: '1983', vinyl: 1.1, cassette: 2.5, cd: 0.1, download: 0, streaming: 0 },
  { year: '1999', vinyl: 0.1, cassette: 0.4, cd: 14.6, download: 0, streaming: 0 },
  { year: '2010', vinyl: 0.2, cassette: 0.0, cd: 3.0, download: 2.8, streaming: 0.4 },
  { year: '2022', vinyl: 1.2, cassette: 0.0, cd: 0.4, download: 0.6, streaming: 13.3 },
];
 
// ─── Shared tooltip formatter helpers ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmtDollar = (value: any, name: any): [string, string] => [
  `$${Number(value ?? 0).toFixed(1)}B`,
  String(name ?? ''),
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmtUnits = (value: any, name: any): [string, string] => [
  `${Number(value ?? 0).toFixed(1)}M`,
  String(name ?? ''),
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmtPct = (value: any, name: any): [string, string] => [
  `${value ?? 0}%`,
  String(name ?? ''),
];
 
// ─── Sub-components ────────────────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: SURFACE_RAISED,
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  color: TEXT_PRIMARY,
  fontSize: 12,
};
 
const DeskKnob = ({ label, color = ACCENT_TEAL }: { label: string; color?: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 0.5 }}>
    <Box
      sx={{
        width: 26, height: 26, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, #444c5c, #2a2d33)`,
        border: `2px solid ${BORDER}`, position: 'relative', cursor: 'pointer',
        '&::after': {
          content: '""', position: 'absolute', width: '2px', height: '11px',
          backgroundColor: color, top: '3px', left: 'calc(50% - 1px)',
          borderRadius: '1px', transform: 'rotate(-40deg)', transformOrigin: 'bottom center',
        },
        '&:hover': { borderColor: color },
      }}
    />
    <Typography variant="caption" sx={{ color: TEXT_MUTED, mt: 0.5, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {label}
    </Typography>
  </Box>
);
 
const DeskFader = ({ label, color = ACCENT_TEAL }: { label: string; color?: string }) => (
  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', p: 1, flexGrow: 1, minWidth: '140px' }}>
    <Typography variant="caption" sx={{ color: TEXT_MUTED, fontSize: '0.6rem', textTransform: 'uppercase', minWidth: '45px', textAlign: 'right' }}>
      {label}
    </Typography>
    <Slider
      orientation="horizontal" defaultValue={65} size="small"
      sx={{
        color,
        '& .MuiSlider-thumb': {
          width: 7, height: 14, borderRadius: 1, backgroundColor: '#555e71',
          border: `1px solid ${BORDER}`, '&:hover': { boxShadow: `0 0 8px ${color}88` },
          '&::before': { display: 'none' },
        },
        '& .MuiSlider-track': { height: 2 },
        '& .MuiSlider-rail': { height: 2, backgroundColor: BORDER },
      }}
    />
  </Stack>
);
 
const MetricCard = ({
  label, value, sub, trend, icon, color = ACCENT_TEAL,
}: {
  label: string; value: string; sub: string; trend?: 'up' | 'down';
  icon: React.ReactNode; color?: string;
}) => (
  <Paper elevation={0} sx={{
    background: SURFACE, border: `1px solid ${BORDER}`, borderTop: `2px solid ${color}`,
    borderRadius: '4px', p: 2, display: 'flex', flexDirection: 'column', gap: 1,
    transition: 'border-color 0.2s', '&:hover': { borderColor: color, boxShadow: `0 0 12px ${color}22` },
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="caption" sx={{ color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>
        {label}
      </Typography>
      <Box sx={{ color, opacity: 0.7 }}>{icon}</Box>
    </Box>
    <Typography variant="h5" sx={{ color: TEXT_PRIMARY, fontWeight: 700, letterSpacing: '-0.5px' }}>
      {value}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {trend === 'up' && <TrendingUpIcon sx={{ fontSize: 14, color: C_VINYL }} />}
      {trend === 'down' && <TrendingDownIcon sx={{ fontSize: 14, color: C_DOWNLOAD }} />}
      <Typography variant="caption" sx={{ color: trend === 'up' ? C_VINYL : trend === 'down' ? C_DOWNLOAD : TEXT_MUTED, fontSize: '0.7rem' }}>
        {sub}
      </Typography>
    </Box>
  </Paper>
);
 
const PanelShell = ({ title, controls, children }: {
  title: string; controls?: React.ReactNode; children: React.ReactNode;
}) => (
  <Paper elevation={0} sx={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '4px', overflow: 'hidden', height: '100%' }}>
    <Box sx={{ background: SURFACE_RAISED, borderBottom: `1px solid ${BORDER}`, px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="caption" sx={{ color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.65rem' }}>
        {title}
      </Typography>
      {controls && <Box>{controls}</Box>}
    </Box>
    <Box sx={{ p: 2, height: 'calc(100% - 33px)', boxSizing: 'border-box' }}>{children}</Box>
  </Paper>
);
 
// ─── Header ────────────────────────────────────────────────────────────────────
const MixerHeader = () => (
  <Box sx={{
    background: SURFACE_RAISED, borderBottom: `1px solid ${BORDER}`,
    px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    position: 'relative',
    '&::before': {
      content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
      background: `linear-gradient(90deg, ${C_STREAMING}, ${C_CD}, ${ACCENT_PINK}, ${C_CASSETTE}, ${C_VINYL})`,
    },
  }}>
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <PowerSettingsNewIcon sx={{ color: ACCENT_TEAL, fontSize: 18 }} />
      <Box>
        <Typography variant="subtitle2" sx={{ color: TEXT_PRIMARY, fontWeight: 700, letterSpacing: '1.5px', fontSize: '0.75rem' }}>
          MUSIC-DISC MASTER-MIX
        </Typography>
        <Typography variant="caption" sx={{ color: TEXT_MUTED, fontSize: '0.6rem', letterSpacing: 1 }}>
          INDUSTRY ANALYTICS · 40 YEARS · RIAA DATA
        </Typography>
      </Box>
    </Stack>
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <DeskKnob label="GAIN" color={C_STREAMING} />
      <DeskKnob label="TRIM" color={C_CD} />
      <DeskKnob label="EQ" color={C_CASSETTE} />
    </Stack>
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      {['1983–2022', 'USD adj.'].map(t => (
        <Chip key={t} label={t} size="small"
          sx={{ backgroundColor: SURFACE, color: TEXT_MUTED, border: `1px solid ${BORDER}`, fontSize: '0.6rem', height: 20 }} />
      ))}
      <AccountCircleIcon sx={{ color: TEXT_MUTED, fontSize: 20 }} />
    </Stack>
  </Box>
);
 
// ─── Chart panels ──────────────────────────────────────────────────────────────
const RevenueStackedChart = ({ data }: { data: YearlyRow[] }) => (
  <PanelShell
    title="Revenue by format — 1983 to 2022"
    controls={
      <Stack direction="row" spacing={0}>
        {['CD', 'STRM', 'VINYL', 'DL'].map((l, i) => (
          <DeskKnob key={l} label={l} color={[C_CD, C_STREAMING, C_VINYL, C_DOWNLOAD][i]} />
        ))}
      </Stack>
    }
  >
    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', mb: 1.5 }}>
      {[
        { label: 'Streaming', color: C_STREAMING },
        { label: 'CD', color: C_CD },
        { label: 'Cassette', color: C_CASSETTE },
        { label: 'Vinyl', color: C_VINYL },
        { label: 'Downloads', color: C_DOWNLOAD },
      ].map(({ label, color }) => (
        <Stack key={label} direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: color }} />
          <Typography variant="caption" sx={{ color: TEXT_MUTED, fontSize: '0.65rem' }}>{label}</Typography>
        </Stack>
      ))}
    </Stack>
    <ResponsiveContainer width="100%" height="80%">
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {[
            { id: 'gStream', color: C_STREAMING }, { id: 'gCD', color: C_CD },
            { id: 'gCass', color: C_CASSETTE }, { id: 'gVinyl', color: C_VINYL },
            { id: 'gDL', color: C_DOWNLOAD },
          ].map(({ id, color }) => (
            <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.5} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
        <XAxis dataKey="year" tick={{ fill: TEXT_MUTED, fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: TEXT_MUTED, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}B`} />
        <Tooltip contentStyle={tooltipStyle} formatter={fmtDollar} />
        <Area type="monotone" dataKey="streaming" name="Streaming" stackId="1" stroke={C_STREAMING} fill="url(#gStream)" strokeWidth={2} />
        <Area type="monotone" dataKey="download" name="Downloads" stackId="1" stroke={C_DOWNLOAD} fill="url(#gDL)" strokeWidth={2} />
        <Area type="monotone" dataKey="cd" name="CD" stackId="1" stroke={C_CD} fill="url(#gCD)" strokeWidth={2} />
        <Area type="monotone" dataKey="cassette" name="Cassette" stackId="1" stroke={C_CASSETTE} fill="url(#gCass)" strokeWidth={2} />
        <Area type="monotone" dataKey="vinyl" name="Vinyl" stackId="1" stroke={C_VINYL} fill="url(#gVinyl)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </PanelShell>
);
 
const StreamingGrowthChart = ({ data }: { data: StreamRow[] }) => {
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const pct = latest && prev ? Math.round(((latest.rev - prev.rev) / prev.rev) * 100) : 8;
  return (
    <PanelShell title="Streaming revenue · 2010–2022" controls={<DeskKnob label="ZOOM" color={C_STREAMING} />}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
        <Typography variant="h5" sx={{ color: C_STREAMING, fontWeight: 700 }}>
          ${latest?.rev ?? 13.3}B
        </Typography>
        <Typography variant="caption" sx={{ color: C_VINYL, fontSize: '0.7rem' }}>↑ {pct}% vs prev year</Typography>
      </Box>
      <ResponsiveContainer width="100%" height="70%">
        <BarChart data={data} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
          <XAxis dataKey="year" tick={{ fill: TEXT_MUTED, fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: TEXT_MUTED, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}B`} />
          <Tooltip contentStyle={tooltipStyle} formatter={fmtDollar} />
          <Bar dataKey="rev" name="Revenue" fill={C_STREAMING} radius={[3, 3, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === data.length - 1 ? ACCENT_TEAL : C_STREAMING} fillOpacity={0.7 + (i / data.length) * 0.3} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </PanelShell>
  );
};
 
const FormatShareChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => (
  <PanelShell title="2022 format share" controls={<DeskKnob label="PAN" color={ACCENT_PINK} />}>
    <ResponsiveContainer width="100%" height="55%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value">
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={fmtPct} />
      </PieChart>
    </ResponsiveContainer>
    <Stack spacing={0.3} sx={{ mt: 1 }}>
      {data.map(({ name, value, color }) => (
        <Box key={name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
            <Typography variant="caption" sx={{ color: TEXT_MUTED, fontSize: '0.65rem' }}>{name}</Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: '0.65rem' }}>{value}%</Typography>
        </Box>
      ))}
    </Stack>
  </PanelShell>
);
 
const VinylRevivalChart = ({ data }: { data: VinylRow[] }) => {
  const latest = data[data.length - 1];
  return (
    <PanelShell title="Vinyl revival · units shipped (M)" controls={<DeskKnob label="BASS" color={C_VINYL} />}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
        <Typography variant="h5" sx={{ color: C_VINYL, fontWeight: 700 }}>{latest?.units ?? 41.3}M</Typography>
        <Typography variant="caption" sx={{ color: TEXT_MUTED, fontSize: '0.7rem' }}>units in {latest?.year ?? 2022}</Typography>
      </Box>
      <ResponsiveContainer width="100%" height="70%">
        <LineChart data={data} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
          <XAxis dataKey="year" tick={{ fill: TEXT_MUTED, fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
          <YAxis tick={{ fill: TEXT_MUTED, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}M`} />
          <Tooltip contentStyle={tooltipStyle} formatter={fmtUnits} />
          <Line type="monotone" dataKey="units" stroke={C_VINYL} strokeWidth={2.5} dot={{ fill: C_VINYL, r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </PanelShell>
  );
};
 
const topGenres = [
  { genre: 'Hip-Hop / R&B', share: 26.8, color: C_STREAMING },
  { genre: 'Pop', share: 19.1, color: ACCENT_PINK },
  { genre: 'Rock', share: 14.4, color: C_CD },
  { genre: 'Country', share: 8.7, color: C_CASSETTE },
  { genre: 'Latin', share: 6.4, color: C_VINYL },
  { genre: 'Dance / Electronic', share: 5.0, color: ACCENT_TEAL },
  { genre: 'Other', share: 19.6, color: C_OTHER },
];
 
const GenreShareChart = () => (
  <PanelShell title="Genre share · 2022" controls={<DeskKnob label="HIGH" color={ACCENT_PINK} />}>
    <Stack spacing={0.8}>
      {topGenres.map(({ genre, share, color }) => (
        <Box key={genre}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
            <Typography variant="caption" sx={{ color: TEXT_MUTED, fontSize: '0.65rem' }}>{genre}</Typography>
            <Typography variant="caption" sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: '0.65rem' }}>{share}%</Typography>
          </Box>
          <Box sx={{ height: 4, backgroundColor: BORDER, borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: `${share * (100 / 26.8)}%`, backgroundColor: color, borderRadius: 3, opacity: 0.85 }} />
          </Box>
        </Box>
      ))}
    </Stack>
  </PanelShell>
);
 
const ChannelSelector = () => {
  const [value, setValue] = useState(0);
  const channels = [
    { label: 'All formats', color: TEXT_MUTED },
    { label: 'Streaming', color: C_STREAMING },
    { label: 'Physical', color: C_VINYL },
    { label: 'Digital DL', color: C_DOWNLOAD },
    { label: 'CD era', color: C_CD },
  ];
  return (
    <PanelShell title="Channel select">
      <Tabs value={value} onChange={(_e, v) => setValue(v)} orientation="vertical" variant="scrollable"
        sx={{ '& .MuiTabs-indicator': { display: 'none' }, minHeight: 'unset' }}>
        {channels.map(({ label, color }, i) => (
          <Tab key={i}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: value === i ? color : BORDER, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontSize: '0.68rem', textAlign: 'left' }}>{label}</Typography>
              </Box>
            }
            sx={{
              color: TEXT_MUTED, minHeight: '38px', alignItems: 'flex-start',
              borderBottom: `1px solid ${BORDER}`, textTransform: 'none', px: 1,
              '&.Mui-selected': { color: channels[value].color },
            }}
          />
        ))}
      </Tabs>
    </PanelShell>
  );
};
 
const LevelMeters = () => (
  <PanelShell title="Level meters">
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mb: 1 }}>
      {[
        { ch: 'STR', pct: 84, color: C_STREAMING },
        { ch: 'VNL', pct: 8, color: C_VINYL },
        { ch: 'CD', pct: 3, color: C_CD },
        { ch: 'DL', pct: 4, color: C_DOWNLOAD },
      ].map(({ ch, pct, color }) => (
        <Box key={ch} sx={{ textAlign: 'center', width: 28 }}>
          <Typography variant="caption" sx={{ color: TEXT_MUTED, fontSize: '0.5rem' }}>{ch}</Typography>
          <Box sx={{
            width: '100%', height: 85, background: SURFACE_RAISED,
            border: `1px solid ${BORDER}`, borderRadius: '2px', position: 'relative', overflow: 'hidden', mt: 0.3,
          }}>
            <Box sx={{
              position: 'absolute', bottom: 0, width: '100%', height: `${pct}%`,
              background: `linear-gradient(to top, ${color}, ${color}88)`, transition: 'height 0.5s',
            }} />
          </Box>
          <Typography variant="caption" sx={{ color, fontSize: '0.5rem', fontWeight: 700 }}>{pct}%</Typography>
        </Box>
      ))}
    </Stack>
    <Stack direction="row" spacing={0} sx={{ justifyContent: 'center' }}>
      {['LOW', 'MID', 'HI'].map((l, i) => (
        <DeskKnob key={l} label={l} color={[C_CASSETTE, C_STREAMING, ACCENT_PINK][i]} />
      ))}
    </Stack>
  </PanelShell>
);
 
// ─── Footer ────────────────────────────────────────────────────────────────────
const MixerFooter = () => (
  <Box sx={{
    background: SURFACE_RAISED, borderTop: `1px solid ${BORDER}`,
    px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <SignalCellularAltIcon sx={{ color: C_VINYL, fontSize: 16 }} />
      <Typography variant="caption" sx={{ color: TEXT_MUTED, fontSize: '0.65rem' }}>SYSTEM: ACTIVE · 44.1kHz</Typography>
    </Stack>
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <DeskFader label="MASTER" color={ACCENT_TEAL} />
      <DeskFader label="FX BUS" color={ACCENT_PINK} />
      <DeskFader label="SUB" color={C_STREAMING} />
    </Stack>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Typography variant="caption" sx={{ color: TEXT_MUTED, fontSize: '0.65rem' }}>v3.0.0 (prod)</Typography>
      <IconButton size="small" sx={{ color: TEXT_MUTED, '&:hover': { color: ACCENT_TEAL } }}>
        <SettingsIcon fontSize="small" />
      </IconButton>
    </Stack>
  </Box>
);
 
// ─── App Component (Full Width & Height Layout) ────────────────────────────────
function App() {
  const [records, setRecords] = useState<MusicRecord[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'music_sales'));
        const data = snapshot.docs.map(d => d.data() as MusicRecord);
        setRecords(data);
      } catch (err) {
        console.error('Error fetching from Firestore:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  const yearlyData   = loading ? FALLBACK_YEARLY : buildYearlyData(records);
  const vinylRevival = loading ? [] : buildVinylRevival(records);
  const streamingGrowth = loading ? [] : buildStreamingGrowth(records);
  const share2022    = loading ? [] : buildShare2022(records);
 
  return (
    <Box 
      sx={{ 
        backgroundColor: BG_DARK, 
        minHeight: '100vh', 
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        color: TEXT_PRIMARY, 
        fontFamily: '"Inter", "Roboto", sans-serif',
        overflow: 'hidden'
      }}
    >
      <MixerHeader />
 
      {loading && (
        <Box sx={{ px: 2, pt: 1 }}>
          <Typography variant="caption" sx={{ color: ACCENT_TEAL, fontSize: '0.65rem', letterSpacing: 1 }}>
            ⟳ LOADING FIRESTORE DATA...
          </Typography>
        </Box>
      )}
 
      {/* Contenedor central flexible sin limitación de ancho (Ocupa el 100% de la ventana) */}
      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, overflowY: 'auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Fila superior: Métricas ampliadas de extremo a extremo */}
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={1.5}>
            {[
              { label: 'Peak revenue', value: '$22.4B', sub: 'Year 1999 (adj.)', icon: <MusicNoteIcon fontSize="small" />, color: C_CD, trend: undefined },
              { label: '2022 revenue', value: '$15.9B', sub: '↑ 9% vs 2021', icon: <TrendingUpIcon fontSize="small" />, color: C_STREAMING, trend: 'up' as const },
              { label: 'Streaming share', value: '84%', sub: 'of 2022 total', icon: <HeadphonesIcon fontSize="small" />, color: ACCENT_TEAL, trend: 'up' as const },
              { label: 'Vinyl units', value: '41.3M', sub: 'Highest since 1987', icon: <AlbumIcon fontSize="small" />, color: C_VINYL, trend: 'up' as const },
              { label: 'CD decline', value: '97%', sub: 'Drop from 2000 peak', icon: <TrendingDownIcon fontSize="small" />, color: C_DOWNLOAD, trend: 'down' as const },
            ].map(props => (
              <Grid key={props.label} size={{ xs: 6, sm: 4, md: 2.4 }}>
                <MetricCard {...props} />
              </Grid>
            ))}
          </Grid>
        </Box>
 
        {/* Fila inferior: Rejilla de gráficos estirada */}
        <Box sx={{ width: '100%', flexGrow: 1 }}>
          <Grid container spacing={1.5} sx={{ height: '100%' }}>
            
            {/* Gráfico de área principal de ancho completo */}
            <Grid size={{ xs: 12 }}>
              <RevenueStackedChart data={yearlyData} />
            </Grid>
            
            {/* Controles verticales */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Stack spacing={1.5} sx={{ height: '100%' }}>
                <ChannelSelector />
                <LevelMeters />
              </Stack>
            </Grid>
            
            {/* Gráficos de barra y línea */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={1.5} sx={{ height: '100%', justifyContent: 'space-between' }}>
                <StreamingGrowthChart data={streamingGrowth} />
                <VinylRevivalChart data={vinylRevival} />
              </Stack>
            </Grid>
            
            {/* Gráficos de pastel y progreso */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={1.5} sx={{ height: '100%', justifyContent: 'space-between' }}>
                <FormatShareChart data={share2022} />
                <GenreShareChart />
              </Stack>
            </Grid>
 
          </Grid>
        </Box>
      </Box>
 
      <MixerFooter />
    </Box>
  );
}
 
export default App;
