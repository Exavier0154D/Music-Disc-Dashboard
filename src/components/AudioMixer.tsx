import { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

type ChannelState = {
  id: string;
  label: string;
  freq: string;
  active: boolean;
  value: number;
  color: string;
};

const PLAYLIST = [
  { id: 1, title: '8-Bit Retro Game Music', file: './audio/8 Bit Retro Game Music_320k.mp3' },
  { id: 2, title: 'Lo-Fi Coding Session', file: './audio/Lo-Fi Coding Session_320k.mp3' },
  { id: 3, title: 'NeoGear 1 - Cyberpunk Cityscape', file: './audio/NeoGear 1 - Cyberpunk Cityscape _ 8-Bit Retrowave_320k.mp3' },
  { id: 4, title: 'Ghost Train', file: './audio/Ghost Train_320k.mp3' }
];

export const AudioMixer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [channels, setChannels] = useState<ChannelState[]>([
    { id: 'ch1', label: 'BASS (Vinilos/Cintas)', freq: '80 Hz', active: false, value: 0, color: '#00E5FF' },
    { id: 'ch2', label: 'MID (CDs/Físico Digital)', freq: '1.2 kHz', active: false, value: 0, color: '#7000FF' },
    { id: 'ch3', label: 'TREBLE (Streaming/Cloud)', freq: '8 kHz', active: false, value: 0, color: '#FF007F' },
    { id: 'ch4', label: 'GAIN MASTER', freq: 'RIAA Volumen', active: false, value: 0, color: '#39FF14' },
  ]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current && audioElementRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const source = ctx.createMediaElementSource(audioElementRef.current);
      sourceRef.current = source;

      const bass = ctx.createBiquadFilter();
      bass.type = 'lowshelf';
      bass.frequency.value = 200;
      bass.gain.value = -40;
      bassFilterRef.current = bass;

      const mid = ctx.createBiquadFilter();
      mid.type = 'peaking';
      mid.Q.value = 1.0;
      mid.frequency.value = 1200;
      mid.gain.value = -40;
      midFilterRef.current = mid;

      const treble = ctx.createBiquadFilter();
      treble.type = 'highshelf';
      treble.frequency.value = 5000;
      treble.gain.value = -40;
      trebleFilterRef.current = treble;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0;
      gainNodeRef.current = gainNode;

      source.connect(bass);
      bass.connect(mid);
      mid.connect(treble);
      treble.connect(gainNode);
      gainNode.connect(ctx.destination);
    }
  };

  useEffect(() => {
    if (!audioElementRef.current) return;

    if (isPlaying) {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      audioElementRef.current.play().catch(err => console.log("Audio play blocked:", err));
    } else {
      audioElementRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    initAudio();
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % PLAYLIST.length);
    if (audioElementRef.current) {
      audioElementRef.current.load();
      if (isPlaying) {
        setTimeout(() => audioElementRef.current?.play(), 100);
      }
    }
  };

  const handleToggle = (id: string) => {
    initAudio();
    setChannels(prev => prev.map(ch => {
      if (ch.id === id) {
        const nextActive = !ch.active;
        updateAudioNode(id, ch.value, nextActive);
        return { ...ch, active: nextActive };
      }
      return ch;
    }));
  };

  const handleSliderChange = (id: string, newValue: number | number[]) => {
    const val = newValue as number;
    setChannels(prev => prev.map(ch => {
      if (ch.id === id) {
        updateAudioNode(id, val, ch.active);
        return { ...ch, value: val };
      }
      return ch;
    }));
  };

  const updateAudioNode = (id: string, value: number, active: boolean) => {
    if (!active) {
      if (id === 'ch4' && gainNodeRef.current) gainNodeRef.current.gain.value = 0;
      if (id === 'ch1' && bassFilterRef.current) bassFilterRef.current.gain.value = -40;
      if (id === 'ch2' && midFilterRef.current) midFilterRef.current.gain.value = -40;
      if (id === 'ch3' && trebleFilterRef.current) trebleFilterRef.current.gain.value = -40;
      return;
    }

    const dbGain = ((value / 100) * 50) - 25;

    switch (id) {
      case 'ch1':
        if (bassFilterRef.current) bassFilterRef.current.gain.value = dbGain;
        break;
      case 'ch2':
        if (midFilterRef.current) midFilterRef.current.gain.value = dbGain;
        break;
      case 'ch3':
        if (trebleFilterRef.current) trebleFilterRef.current.gain.value = dbGain;
        break;
      case 'ch4':
        if (gainNodeRef.current) gainNodeRef.current.gain.value = value / 100;
        break;
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        backgroundColor: '#111625', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        borderRadius: 4, 
        p: 4, 
        width: '100%', 
        boxSizing: 'border-box'
      }}
    >
      <audio 
        ref={audioElementRef} 
        src={PLAYLIST[currentTrackIndex].file} 
        loop
        crossOrigin="anonymous"
      />

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <GraphicEqIcon sx={{ color: '#39FF14', fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
              Consola de Ecualización Histórica (Frecuencias de Mercado)
            </Typography>
            <Typography variant="caption" sx={{ color: '#39FF14', fontWeight: 'medium' }}>
              Pista Activa: {PLAYLIST[currentTrackIndex].title}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#0B0F19', p: 1, borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <IconButton 
            onClick={togglePlay}
            sx={{ color: isPlaying ? '#39FF14' : '#fff', '&:active': { transform: 'scale(0.92)' } }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton 
            onClick={handleNextTrack}
            sx={{ color: '#fff', '&:active': { transform: 'scale(0.92)' } }}
          >
            <SkipNextIcon />
          </IconButton>
          <VolumeUpIcon sx={{ color: 'rgba(255, 255, 255, 0.3)', mx: 1 }} />
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        {channels.map((ch) => (
          <Grid 
            key={ch.id} 
            size={{ xs: 12, sm: 6, md: 3 }} 
            sx={{ 
              p: '0 !important', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              px: 1 
            }}
          >
            <Box 
              sx={{ 
                width: '100%', 
                backgroundColor: '#0B0F19', 
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 3, 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                opacity: ch.active ? 1 : 0.4,
                transition: 'all 0.3s ease'
              }}
            >
              <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5, textAlign: 'center' }}>
                {ch.label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', mb: 3 }}>
                {ch.freq}
              </Typography>

              <Box sx={{ height: 160, mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Slider
                  orientation="vertical"
                  value={ch.value}
                  disabled={!ch.active}
                  onChange={(_, val) => handleSliderChange(ch.id, val)}
                  sx={{
                    color: ch.color,
                    '& .MuiSlider-thumb': {
                      width: 20,
                      height: 10,
                      borderRadius: '2px',
                      backgroundColor: '#fff',
                      boxShadow: `0 0 10px ${ch.color}`,
                    },
                    '& .MuiSlider-rail': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                />
              </Box>

              <ToggleButton
                value="check"
                selected={ch.active}
                onChange={() => handleToggle(ch.id)}
                sx={{
                  width: '100%',
                  maxWidth: 120,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: ch.active ? `${ch.color}22` : 'rgba(255, 255, 255, 0.05)',
                  color: ch.active ? ch.color : 'rgba(255, 255, 255, 0.3)',
                  border: `1px solid ${ch.active ? ch.color : 'rgba(255, 255, 255, 0.1)'}`,
                  fontWeight: 'bold',
                  fontSize: '12px',
                  letterSpacing: '1px',
                  '&:active': { transform: 'scale(0.95)' }
                }}
              >
                {ch.active ? 'ON AIR' : 'MUTE'}
              </ToggleButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};