import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createInterface } from 'node:readline';

const API_BASE = 'https://api.lws.net/v1';
const DOMAIN = 'slaacvoyages.com';

async function promptSilent(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim());
    });
  });
}

async function getCredentials() {
  let login = process.env.LWS_AUTH_LOGIN;
  let pass = process.env.LWS_AUTH_PASS;

  if (!login || !pass) {
    try {
      const envPath = resolve(process.cwd(), '.env.lws.local');
      const content = readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (m) {
          const k = m[1].trim();
          let v = m[2].trim().replace(/^["\x27]|["\x27]$/g, '');
          if (k === 'LWS_AUTH_LOGIN') login = v;
          if (k === 'LWS_AUTH_PASS') pass = v;
        }
      }
    } catch {}
  }

  if (!login) {
    login = await promptSilent('Identifiant Client LWS (X-Auth-Login) : ');
  }
  if (!pass) {
    pass = await promptSilent('Nouvelle Clé API LWS (X-Auth-Pass) : ');
  }

  if (!login || !pass) {
    throw new Error('Identifiants LWS manquants. Veuillez fournir X-Auth-Login et X-Auth-Pass.');
  }

  return { login, pass };
}

async function lwsRequest(method, path, body = null, creds) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'X-Auth-Login': creds.login,
    'X-Auth-Pass': creds.pass,
    'Accept': 'application/json',
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  return { status: res.status, ok: res.ok, data: json };
}

export async function backupZone(creds) {
  console.log(`[LWS API] Récupération de la zone DNS pour ${DOMAIN}...`);
  const res = await lwsRequest('GET', `/domain/${DOMAIN}/zdns`, null, creds);
  if (!res.ok) {
    throw new Error(`Erreur récupération zone DNS (${res.status}) : ${JSON.stringify(res.data)}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = resolve(process.cwd(), 'reports/dns-backups');
  mkdirSync(backupDir, { recursive: true });
  const backupPath = join(backupDir, `backup-${DOMAIN}-${timestamp}.json`);
  writeFileSync(backupPath, JSON.stringify(res.data, null, 2), 'utf8');

  console.log(`✓ Zone DNS sauvegardée avec succès dans : ${backupPath}`);
  return { records: res.data, backupPath };
}

export async function applyDnsChanges(creds, currentRecords) {
  // Déterminer les enregistrements A, AAAA et CNAME www
  const records = Array.isArray(currentRecords) ? currentRecords : (currentRecords.data || currentRecords.records || []);

  const aApex = records.find((r) => r.type === 'A' && (r.name === '@' || r.name === DOMAIN || r.name === ''));
  const aaaaApex = records.find((r) => r.type === 'AAAA' && (r.name === '@' || r.name === DOMAIN || r.name === ''));
  const cnameWww = records.find((r) => (r.type === 'CNAME' || r.type === 'A') && r.name === 'www');

  console.log('\n--- APPLICATION DES MODIFICATIONS DNS VERCEL ---');

  // 1. Apex A -> 216.198.79.1
  if (aApex) {
    console.log(`[1/3] Mise à jour de l'enregistrement A apex (ID: ${aApex.id})...`);
    const putRes = await lwsRequest('PUT', `/domain/${DOMAIN}/zdns`, {
      id: aApex.id,
      type: 'A',
      name: '@',
      value: '216.198.79.1',
      ttl: 3600,
    }, creds);
    if (!putRes.ok) throw new Error(`Échec mise à jour A apex : ${JSON.stringify(putRes.data)}`);
    console.log('✓ Enregistrement A apex mis à jour vers 216.198.79.1 (TTL 3600)');
  } else {
    console.log(`[1/3] Création de l'enregistrement A apex...`);
    const postRes = await lwsRequest('POST', `/domain/${DOMAIN}/zdns`, {
      type: 'A',
      name: '@',
      value: '216.198.79.1',
      ttl: 3600,
    }, creds);
    if (!postRes.ok) throw new Error(`Échec création A apex : ${JSON.stringify(postRes.data)}`);
    console.log('✓ Enregistrement A apex créé vers 216.198.79.1 (TTL 3600)');
  }

  // 2. Apex AAAA -> Suppression pour éviter les conflits IPv6 avec l'ancien hébergeur
  if (aaaaApex) {
    console.log(`[2/3] Suppression de l'ancien enregistrement AAAA LWS (ID: ${aaaaApex.id})...`);
    const delRes = await lwsRequest('DELETE', `/domain/${DOMAIN}/zdns`, {
      id: aaaaApex.id,
    }, creds);
    if (!delRes.ok) {
      console.warn(`! Avertissement suppression AAAA : ${JSON.stringify(delRes.data)}`);
    } else {
      console.log('✓ Enregistrement AAAA supprimé (évite les conflits IPv6)');
    }
  } else {
    console.log('[2/3] Aucun enregistrement AAAA à supprimer.');
  }

  // 3. CNAME www -> 3a041033f83871cc.vercel-dns-017.com.
  const vercelCnameTarget = '3a041033f83871cc.vercel-dns-017.com.';
  if (cnameWww) {
    console.log(`[3/3] Mise à jour du CNAME www (ID: ${cnameWww.id})...`);
    const putWww = await lwsRequest('PUT', `/domain/${DOMAIN}/zdns`, {
      id: cnameWww.id,
      type: 'CNAME',
      name: 'www',
      value: vercelCnameTarget,
      ttl: 3600,
    }, creds);
    if (!putWww.ok) throw new Error(`Échec mise à jour CNAME www : ${JSON.stringify(putWww.data)}`);
    console.log(`✓ CNAME www mis à jour vers ${vercelCnameTarget} (TTL 3600)`);
  } else {
    console.log(`[3/3] Création du CNAME www...`);
    const postWww = await lwsRequest('POST', `/domain/${DOMAIN}/zdns`, {
      type: 'CNAME',
      name: 'www',
      value: vercelCnameTarget,
      ttl: 3600,
    }, creds);
    if (!postWww.ok) throw new Error(`Échec création CNAME www : ${JSON.stringify(postWww.data)}`);
    console.log(`✓ CNAME www créé vers ${vercelCnameTarget} (TTL 3600)`);
  }

  console.log('\n✓ Toutes les modifications DNS ont été transmises à LWS avec succès !');
}

async function main() {
  const creds = await getCredentials();
  const { records, backupPath } = await backupZone(creds);
  console.log(`\nZone actuelle (${records.length || 'N/A'} enregistrements) inspectée.`);
  if (process.argv.includes('--apply')) {
    await applyDnsChanges(creds, records);
  } else {
    console.log('\nMode lecture/sauvegarde terminé. Passez --apply pour appliquer les modifications.');
  }
}

if (process.argv[1] && process.argv[1].endsWith('lws-dns.mjs')) {
  main().catch((err) => {
    console.error('Erreur LWS DNS :', err.message);
    process.exit(1);
  });
}
