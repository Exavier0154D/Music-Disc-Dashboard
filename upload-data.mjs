// ─── Script de importación a Firestore ───────────────────────────────────────
// Ejecutar desde la RAÍZ del proyecto con:  node upload-data.mjs
// Asegúrate de tener el JSON en la misma carpeta raíz del proyecto.

import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: "AIzaSyAzqdNEwFgvwHtNNbdNXwSAFmRN6ttkiPc",
  authDomain: "music-industry-dashboard.firebaseapp.com",
  projectId: "music-industry-dashboard",
  storageBucket: "music-industry-dashboard.firebasestorage.app",
  messagingSenderId: "360704066649",
  appId: "1:360704066649:web:593f1ece7864360eed9d48",
  measurementId: "G-9MYTN975L8"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// Lee el archivo JSON (ajusta el nombre si es diferente)
const jsonPath = join(__dirname, "excel2json-1781110423966.json");
const data = JSON.parse(readFileSync(jsonPath, "utf-8"));

console.log(`📦 Total de registros a subir: ${data.length}`);

async function uploadData() {
  const colRef   = collection(db, "music_sales");
  const BATCH_SZ = 500; // límite de Firestore por batch

  for (let i = 0; i < data.length; i += BATCH_SZ) {
    const batch = writeBatch(db);
    const chunk = data.slice(i, i + BATCH_SZ);

    chunk.forEach((item) => {
      batch.set(doc(colRef), item);
    });

    await batch.commit();
    const done = Math.min(i + BATCH_SZ, data.length);
    const pct  = ((done / data.length) * 100).toFixed(0);
    console.log(`✅ ${done} / ${data.length}  (${pct}%)`);
  }

  console.log("\n🎉 ¡Importación completa! Revisa Firestore en la consola de Firebase.");
  process.exit(0);
}

uploadData().catch((err) => {
  console.error("❌ Error durante la importación:", err);
  process.exit(1);
});