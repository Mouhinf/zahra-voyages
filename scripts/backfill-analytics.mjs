import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadServiceAccount() {
  const envLocal = readFileSync(resolve(__dirname, '../.env.local'), 'utf8');
  const match = envLocal.match(/^FIREBASE_SERVICE_ACCOUNT_KEY=(.+)$/m);
  const raw = match[1].trim().replace(/^["\x27]|["\x27]$/g, '');
  return JSON.parse(raw);
}

async function main() {
  const sa = loadServiceAccount();
  const { initializeApp, cert } = await import('firebase-admin/app');
  const app = initializeApp({ credential: cert(sa) });
  const { getFirestore, FieldValue } = await import('firebase-admin/firestore');
  const db = getFirestore(app);

  console.log('Reading historical analytics collection...');
  const snap = await db.collection('analytics').get();
  console.log(`Found ${snap.size} historical records.`);

  const dailyCounts = {};

  snap.forEach((doc) => {
    const data = doc.data();
    let dateStr = '2026-10-14';
    if (data.timestamp?._seconds) {
      dateStr = new Date(data.timestamp._seconds * 1000).toISOString().slice(0, 10);
    } else if (data.timestamp?.toDate) {
      dateStr = data.timestamp.toDate().toISOString().slice(0, 10);
    }

    if (!dailyCounts[dateStr]) {
      dailyCounts[dateStr] = {
        date: dateStr,
        pageViews: 0,
        uniqueSessions: 0,
        ctaClicks: 0,
        whatsappClicks: 0,
        quoteStarts: 0,
        pages: {},
        sources: {},
        campaigns: {},
        countries: { SN: 0 },
        devices: { desktop: 0 },
      };
    }

    const day = dailyCounts[dateStr];
    day.pageViews += 1;
    day.uniqueSessions += 1;
    const page = String(data.page || '/').replace(/[.~*/[\]]/g, '_');
    day.pages[page] = (day.pages[page] || 0) + 1;
    const source = String(data.source || 'direct').replace(/[.~*/[\]]/g, '_');
    day.sources[source] = (day.sources[source] || 0) + 1;
    day.devices.desktop += 1;
    day.countries.SN += 1;
  });

  console.log('Aggregating into analyticsDaily...');
  for (const [date, payload] of Object.entries(dailyCounts)) {
    console.log(`  Writing ${date} (${payload.pageViews} views)...`);
    await db.collection('analyticsDaily').doc(date).set(payload, { merge: true });
  }

  console.log('Backfill complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
