import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

import EqualizerIcon from '@mui/icons-material/Equalizer';
import AlbumIcon from '@mui/icons-material/Album';
import StarIcon from '@mui/icons-material/Star';
import RadioIcon from '@mui/icons-material/Radio';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { db } from './config/firebase';
import { ref, onValue } from 'firebase/database';
import type { MusicRecord } from './types';
import { PALETTE } from './constants/theme';

import { KpiCard } from './components/KpiCard';
import { RevenueChart } from './components/RevenueChart';
import { MusicStats } from './components/MusicStats';
import { AudioMixer } from './components/AudioMixer';

const FORMAT_TRIVIA: Record<string, { artist: string; album: string; year: string; fact: string }> = {
  'ALL': { artist: 'Artistas Globales', album: 'Compilados Históricos', year: '1973 - 2022', fact: 'La evolución de la industria musical medida a través de las certificaciones de la RIAA.' },
  'Vinyl': { artist: 'Michael Jackson', album: 'Thriller', year: 'Era Dorada', fact: 'El vinilo más vendido de todos los tiempos superando los 70M de copias.' },
  'LP/EP': { artist: 'Pink Floyd', album: 'The Dark Side of the Moon', year: '1973', fact: 'Marcó el récord histórico permaneciendo más de 900 semanas en las listas.' },
  'Cassette': { artist: 'Madonna / Prince', album: 'Like a Virgin / Purple Rain', year: '1980s', fact: 'El formato impulsado por el Walkman urbano portátil.' },
  'Cassette Single': { artist: 'Bryan Adams', album: '(Everything I Do) I Do It for You', year: '1991', fact: 'Formato clave para los sencillos de alta difusión radial antes del CD.' },
  'CD': { artist: 'The Eagles / Backstreet Boys', album: 'Their Greatest Hits / Millennium', year: '1990s', fact: 'El gigante digital físico que generó el pico histórico de ingresos de la industria.' },
  'CD Single': { artist: 'Whitney Houston', album: 'I Will Always Love You', year: '1992', fact: 'Dominó las listas de sencillos físicos manteniéndose 14 semanas en el puesto N°1.' },
  '8-Track': { artist: 'Elvis Presley / Led Zeppelin', album: 'Aloha from Hawaii / Led Zeppelin IV', year: '1970s', fact: 'Cartuchos icónicos que dominaron los sistemas de audio de los automóviles norteamericanos.' },
  'Other Tapes': { artist: 'Varios Artistas', album: 'Grabaciones de Estudio', year: '1970s', fact: 'Formatos magnéticos residuales y carretes abiertos de uso semi-profesional.' },
  'Music Video (Physical)': { artist: 'Michael Jackson', album: 'The Making of Thriller', year: '1983', fact: 'Revolucionó el formato convirtiendo el video musical en un producto comercial premium.' },
  'DVD Audio': { artist: 'Steely Dan', album: 'Everything Must Go', year: 'Early 2000s', fact: 'Formato físico de alta fidelidad diseñado para sonido envolvente 5.1.' },
  'SACD': { artist: 'Pink Floyd', album: 'Dark Side (Re-edition 30th)', year: '2003', fact: 'Super Audio CD usado por audiófilos para obtener máxima resolución de audio.' },
  'Download Single': { artist: 'Rihanna / Black Eyed Peas', album: 'Disturbia / I Gotta Feeling', year: '2000s', fact: 'Líderes absolutos del boom de descargas digitales en la era dorada de iTunes.' },
  'Download Album': { artist: 'Coldplay / Eminem', album: 'Viva la Vida / Recovery', year: '2008-2010', fact: 'Marcó la transición donde los usuarios compraban álbumes enteros comprimidos en MP3.' },
  'Kiosk': { artist: 'Artistas Independientes', album: 'Descargas Rápidas', year: '2000s', fact: 'Estaciones físicas en tiendas donde descargabas canciones directo a memorias USB.' },
  'Download Music Video': { artist: 'Beyoncé', album: 'B\'Day Anthology', year: '2006', fact: 'Venta masiva de videos musicales en formato digital a través de la tienda virtual Apple Music.' },
  'Ringtones & Ringbacks': { artist: 'Lil Wayne / T-Pain', album: 'Lollipop', year: '2000s', fact: 'Negocio millonario donde los usuarios pagaban hasta $3 por un tono de llamada de 30 segundos.' },
  'Paid Subscriptions': { artist: 'Taylor Swift / Drake', album: 'Midnights / Scorpion', year: 'Actualidad', fact: 'Suscripciones premium de plataformas como Spotify y Apple Music impulsando la industria.' },
  'Limited Tier Paid Subscription': { artist: 'Artistas Pop Populares', album: 'Plataformas de Radio', year: '2010s', fact: 'Servicios de streaming con limitaciones (como Pandora Plus o Amazon Music Prime).' },
  'On-Demand Streaming (Ad-Supported)': { artist: 'Bad Bunny / Justin Bieber', album: 'Un Verano Sin Ti', year: 'Actualidad', fact: 'Consumo gratuito masivo monetizado 100% mediante anuncios publicitarios en YouTube y Spotify Free.' },
  'Other Ad-Supported Streaming': { artist: 'Artistas Independientes', album: 'Plataformas Web', year: '2010s', fact: 'Ingresos por reproducciones en radios digitales personalizadas basadas en publicidad.' },
  'Other Digital': { artist: 'Artistas Variados', album: 'Licencias Web', year: 'Moderno', fact: 'Formatos y distribuciones digitales alternativas de la era del internet temprano.' },
  'Paid Subscription': { artist: 'Taylor Swift', album: '1989 (Taylor\'s Version)', year: 'Actualidad', fact: 'Ingresos recurrentes estables de usuarios premium en plataformas globales.' },
  'SoundExchange Distributions': { artist: 'Artistas de Radio Satelital', album: 'Transmisiones Digitales', year: '2000s-Hoy', fact: 'Regalías recaudadas por transmisiones no interactivas en servicios como SiriusXM.' },
  'Synchronization': { artist: 'Kate Bush / Metallica', album: 'Running Up That Hill / Master of Puppets', year: 'Histórico-Hoy', fact: 'Ingresos generados por el uso de canciones en películas, videojuegos y series (como Stranger Things).' }
};

function App() {
  const [records, setRecords] = useState<MusicRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  
  const [versusA, setVersusA] = useState<string>('Vinyl');
  const [versusB, setVersusB] = useState<string>('Streaming');

  useEffect(() => {
    const musicSalesRef = ref(db);
    const unsubscribe = onValue(musicSalesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          setRecords(Object.values(data) as MusicRecord[]);
        } else {
          setRecords([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const uniqueFormats = Array.from(new Set(records.map(r => r.Format).filter(Boolean))).sort();

  const handleFormatChange = (event: SelectChangeEvent<string>) => {
    setSelectedFormat(event.target.value);
  };

  const filteredRecords = selectedFormat === 'ALL' ? records : records.filter(r => r.Format === selectedFormat);

  const totalRevenue = filteredRecords
    .filter(r => r.Metric && r.Metric.includes('Value'))
    .reduce((acc, curr) => acc + (curr['Value(Actual)'] || 0), 0);

  const totalUnits = filteredRecords
    .filter(r => r.Metric === 'Units')
    .reduce((acc, curr) => acc + (curr['Value(Actual)'] || 0), 0);

  const valueRecords = filteredRecords.filter(r => r.Metric === 'Value (Adjusted)');
  let peakYear = 'N/A';
  if (valueRecords.length > 0) {
    const peakRecord = valueRecords.reduce((max, r) => (r['Value(Actual)'] > max['Value(Actual)'] ? r : max), valueRecords[0]);
    peakYear = String(peakRecord.Year);
  }

  const calculateTotalValue = (formatName: string) => {
    return records
      .filter(r => r.Format === formatName && r.Metric && r.Metric.includes('Value'))
      .reduce((acc, curr) => acc + (curr['Value(Actual)'] || 0), 0) / 1000000000;
  };

  const revenueA = calculateTotalValue(versusA);
  const revenueB = calculateTotalValue(versusB);
  const totalVersus = revenueA + revenueB || 1;
  const pctA = Math.round((revenueA / totalVersus) * 100);
  const pctB = 100 - pctA;

  const years = Array.from(new Set(records.map(r => r.Year))).sort((a, b) => a - b);
  const chartData = years.map(year => {
    const dataRow: Record<string, number | string> = { year: String(year) };
    const keyName = selectedFormat === 'ALL' ? 'Todos los Formatos' : selectedFormat;
    
    const cellRecords = records.filter(r => r.Year === year && r.Metric === 'Value (Adjusted)' && (selectedFormat === 'ALL' || r.Format === selectedFormat));
    dataRow[keyName] = cellRecords.reduce((acc, curr) => acc + (curr['Value(Actual)'] / 1000000000), 0);
    
    return dataRow;
  });

  const activeKeys = [selectedFormat === 'ALL' ? 'Todos los Formatos' : selectedFormat];
  const currentFact = FORMAT_TRIVIA[selectedFormat] || FORMAT_TRIVIA['ALL'];

  if (loading) {
    return (
      <Box sx={{ backgroundColor: PALETTE.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: PALETTE.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: PALETTE.bg, minHeight: '100vh', width: '100%', py: 4, px: 4, m: 0, boxSizing: 'border-box' }}>
      <Container maxWidth={false} disableGutters sx={{ width: '100%', m: 0, p: 0 }}>
        
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: PALETTE.textMain, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <RadioIcon sx={{ color: PALETTE.primary, fontSize: 38 }} /> Arena de Datos Musicales
            </Typography>
            <Typography variant="body2" sx={{ color: PALETTE.textMuted, mt: 0.5 }}>
              Explora las métricas de un formato específico o compáralos en el versus histórico abajo.
            </Typography>
          </Box>

          <FormControl sx={{ minWidth: 320, maxWidth: '100%' }}>
            <InputLabel 
              id="format-select-label" 
              sx={{ 
                color: '#00E5FF', 
                fontWeight: 'bold',
                fontSize: '16px',
                letterSpacing: '0.5px',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -8px) scale(0.85)'
                },
                '&.Mui-focused': { color: '#FF007F' } 
              }}
            >
              Seleccionar Formato
            </InputLabel>
            <Select
              labelId="format-select-label"
              value={selectedFormat}
              onChange={handleFormatChange}
              input={<OutlinedInput label="Seleccionar Formato" />}
              sx={{
                backgroundColor: '#0F1524',
                color: '#fff',
                borderRadius: 3,
                fontWeight: 'bold',
                fontSize: '16px',
                letterSpacing: '0.5px',
                height: '56px',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(0, 229, 255, 0.3)',
                boxShadow: '0 0 12px rgba(0, 229, 255, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': {
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  paddingLeft: '18px'
                },
                '&:hover': {
                  border: '2px solid #00E5FF',
                  boxShadow: '0 0 18px rgba(0, 229, 255, 0.25)',
                  backgroundColor: '#131A2E',
                },
                '&.Mui-focused': {
                  border: '2px solid #FF007F',
                  boxShadow: '0 0 22px rgba(255, 0, 127, 0.35)',
                  backgroundColor: '#131A2E',
                },
                '& .MuiSelect-icon': {
                  color: '#00E5FF',
                  fontSize: '28px',
                  right: '12px',
                  transition: 'color 0.3s ease'
                },
                '&.Mui-focused .MuiSelect-icon': {
                  color: '#FF007F'
                }
              }}
            >
              <MenuItem value="ALL"><em>Todos los Formatos</em></MenuItem>
              {uniqueFormats.map((name) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3} sx={{ width: '100%', m: 0, mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }} sx={{ p: '0 !important', pr: { md: 2 }, pb: { xs: 2, md: 0 } }}>
            <KpiCard title="Ingresos Totales (Filtro)" value={`$${(totalRevenue / 1000000000).toFixed(1)}B`} icon={<EqualizerIcon />} color={PALETTE.primary} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ p: '0 !important', px: { md: 1 }, pb: { xs: 2, md: 0 } }}>
            <KpiCard title="Volumen de Unidades Vendidas" value={totalUnits > 0 ? `${(totalUnits / 1000000).toFixed(1)}M` : 'N/A'} icon={<AlbumIcon />} color={PALETTE.success} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ p: '0 !important', pl: { md: 2 } }}>
            <KpiCard title="Pico Máximo de Ingresos" value={peakYear} icon={<CalendarMonthIcon />} color={PALETTE.warning} />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ width: '100%', m: 0, mb: 4, display: 'flex', alignItems: 'stretch' }}>
          <Grid size={{ xs: 12, lg: 8 }} sx={{ p: '0 !important', pr: { lg: 2 }, pb: { xs: 3, lg: 0 } }}>
            <RevenueChart data={chartData} dataKeys={activeKeys} />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }} sx={{ p: '0 !important', display: 'flex' }}>
            <Paper 
              sx={{ 
                backgroundColor: '#111625', 
                background: 'linear-gradient(135deg, #111625 0%, #0D121F 100%)',
                border: '1px solid rgba(255, 215, 0, 0.2)', 
                borderRadius: 4, 
                p: 4, 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  borderColor: '#FFD700',
                  boxShadow: '0 8px 30px rgba(255, 215, 0, 0.15)',
                  '& .floating-bg-icon': {
                    transform: 'scale(1.1) rotate(15deg)',
                    opacity: 0.08,
                    color: '#FFD700'
                  }
                }
              }}
            >
              <StarIcon 
                className="floating-bg-icon"
                sx={{ 
                  position: 'absolute', 
                  right: -20, 
                  bottom: -20, 
                  fontSize: 180, 
                  color: '#fff', 
                  opacity: 0.02, 
                  transition: 'all 0.4s ease',
                  pointerEvents: 'none'
                }} 
              />

              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, mb: 2, zIndex: 1 }}>
                <StarIcon sx={{ filter: 'drop-shadow(0 0 8px #FFD700)' }} /> Hito de la Era: {selectedFormat === 'ALL' ? 'Todos' : selectedFormat}
              </Typography>
              
              <Divider sx={{ borderColor: 'rgba(255, 215, 0, 0.15)', mb: 3, zIndex: 1 }} />
              
              <Box sx={{ mb: 2.5, zIndex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
                  Álbum / Ícono Referente
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold', fontSize: '17px', mt: 0.5 }}>
                  {currentFact.album}
                </Typography>
              </Box>

              <Box sx={{ mb: 2.5, zIndex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
                  Artista Dominante
                </Typography>
                <Typography variant="body1" sx={{ color: '#00E5FF', fontWeight: 'bold', fontSize: '18px', mt: 0.5, filter: 'drop-shadow(0 0 4px rgba(0,229,255,0.2))' }}>
                  {currentFact.artist}
                </Typography>
              </Box>

              <Box sx={{ zIndex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
                  Dato Curioso de la RIAA
                </Typography>
                <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.02)', mt: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.75)', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{currentFact.fact}"
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ backgroundColor: '#111625', border: `1px solid ${PALETTE.border}`, borderRadius: 4, p: 4, width: '100%', m: 0, mb: 4, boxSizing: 'border-box' }}>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlashOnIcon sx={{ color: '#FF007F' }} /> Duelo en Vivo: Versus Histórico
          </Typography>
          
          <Grid container spacing={4} sx={{ width: '100%', m: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Grid size={{ xs: 12, md: 4 }} sx={{ p: '0 !important', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <FormControl fullWidth sx={{ mb: 2, maxWidth: 280 }}>
                <Select value={versusA} onChange={(e) => setVersusA(e.target.value)} sx={{ backgroundColor: PALETTE.surface, color: '#fff', borderRadius: 2 }}>
                  {uniqueFormats.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="h4" sx={{ color: '#00E5FF', fontWeight: 'bold' }}>${revenueA.toFixed(1)}B</Typography>
              <Typography variant="caption" sx={{ color: PALETTE.textMuted, mt: 0.5 }}>Ingresos Totales Registrados</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} sx={{ p: '0 !important', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', px: { md: 2 }, pb: { xs: 3, md: 0 } }}>
              <Box sx={{ display: 'flex', height: 26, width: '100%', maxWidth: 320, borderRadius: 12, overflow: 'hidden', mb: 1, border: '2px solid #222' }}>
                <Box sx={{ width: `${pctA}%`, backgroundColor: '#00E5FF', transition: 'width 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#000', fontWeight: 'bold' }}>{pctA}%</Typography>
                </Box>
                <Box sx={{ width: `${pctB}%`, backgroundColor: '#FF007F', transition: 'width 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold' }}>{pctB}%</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: PALETTE.textMuted, fontWeight: 'bold', letterSpacing: '1px' }}>PROPORCIÓN DE MERCADO</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} sx={{ p: '0 !important', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <FormControl fullWidth sx={{ mb: 2, maxWidth: 280 }}>
                <Select value={versusB} onChange={(e) => setVersusB(e.target.value)} sx={{ backgroundColor: PALETTE.surface, color: '#fff', borderRadius: 2 }}>
                  {uniqueFormats.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="h4" sx={{ color: '#FF007F', fontWeight: 'bold' }}>${revenueB.toFixed(1)}B</Typography>
              <Typography variant="caption" sx={{ color: PALETTE.textMuted, mt: 0.5 }}>Ingresos Totales Registrados</Typography>
            </Grid>
          </Grid>
        </Paper>

        <MusicStats />

        <AudioMixer />

      </Container>
    </Box>
  );
}

export default App;