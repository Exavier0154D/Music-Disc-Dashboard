import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
 
export type MusicRecord = {
  Format: string;
  Metric: string;
  Year: number;
  "Value(Actual)": number;
};
 
// Formatos que se agrupan en cada categoría del dashboard
const STREAMING_FORMATS = ["On-Demand Streaming (Ad-Supported)", "Paid Subscription", "Limited Tier (Paid)", "Other Ad-Supported Streaming"];
const VINYL_FORMATS = ["LP/EP"];
const CD_FORMATS = ["CD"];
const DOWNLOAD_FORMATS = ["Download Album", "Download Single", "Download Music Video", "Kiosk"];
const CASSETTE_FORMATS = ["Cassette"];
 
function groupByYear(records: MusicRecord[]) {
  const map: Record<number, Record<string, number>> = {};
 
  records.forEach(({ Format, Year, "Value(Actual)": val }) => {
    if (!map[Year]) map[Year] = { streaming: 0, vinyl: 0, cd: 0, download: 0, cassette: 0 };
 
    const v = (val ?? 0) / 1_000_000_000; // convertir a billones USD
 
    if (STREAMING_FORMATS.includes(Format)) map[Year].streaming += v;
    else if (VINYL_FORMATS.includes(Format))  map[Year].vinyl    += v;
    else if (CD_FORMATS.includes(Format))     map[Year].cd       += v;
    else if (DOWNLOAD_FORMATS.includes(Format)) map[Year].download += v;
    else if (CASSETTE_FORMATS.includes(Format)) map[Year].cassette += v;
  });
 
  return Object.entries(map)
    .map(([year, vals]) => ({ year: String(year), ...vals }))
    .sort((a, b) => Number(a.year) - Number(b.year));
}
 
export function useFirebaseData() {
  const [yearlyData, setYearlyData]       = useState<ReturnType<typeof groupByYear>>([]);
  const [streamingGrowth, setStreaming]   = useState<{ year: string; rev: number }[]>([]);
  const [vinylRevival, setVinyl]          = useState<{ year: string; units: number }[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
 
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Revenue ajustado para las gráficas principales
        const revenueQ = query(
          collection(db, "music_sales"),
          where("Metric", "==", "Value (Adjusted)")
        );
        const revenueSnap = await getDocs(revenueQ);
        const revenueRecords = revenueSnap.docs.map(d => d.data() as MusicRecord);
        setYearlyData(groupByYear(revenueRecords));
 
        // 2. Streaming growth (solo streaming, valor ajustado)
        const streamRecords = revenueRecords.filter(r => STREAMING_FORMATS.includes(r.Format));
        const streamMap: Record<number, number> = {};
        streamRecords.forEach(({ Year, "Value(Actual)": val }) => {
          streamMap[Year] = (streamMap[Year] ?? 0) + (val ?? 0) / 1_000_000_000;
        });
        setStreaming(
          Object.entries(streamMap)
            .map(([year, rev]) => ({ year, rev: parseFloat(rev.toFixed(2)) }))
            .sort((a, b) => Number(a.year) - Number(b.year))
        );
 
        // 3. Vinyl units (Metric = "Units")
        const vinylQ = query(
          collection(db, "music_sales"),
          where("Metric", "==", "Units"),
          where("Format", "==", "LP/EP")
        );
        const vinylSnap = await getDocs(vinylQ);
        const vinylRecords = vinylSnap.docs.map(d => d.data() as MusicRecord);
        setVinyl(
          vinylRecords
            .map(({ Year, "Value(Actual)": val }) => ({
              year: String(Year),
              units: parseFloat(((val ?? 0) / 1_000_000).toFixed(1)), // en millones
            }))
            .sort((a, b) => Number(a.year) - Number(b.year))
        );
 
        setLoading(false);
      } catch (err) {
        console.error("Error cargando datos de Firebase:", err);
        setError("Error al conectar con Firebase. Revisa la consola.");
        setLoading(false);
      }
    };
 
    fetchAll();
  }, []);
 
  return { yearlyData, streamingGrowth, vinylRevival, loading, error };
}