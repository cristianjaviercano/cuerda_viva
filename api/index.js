import path from 'path';
import { fileURLToPath } from 'url';
import { createRequestHandler } from '../server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbFile = process.env.VERCEL
  ? path.join('/tmp', 'users_db.json')
  : path.join(rootDir, 'data', 'users_db.json');

const handler = createRequestHandler({ rootDir, dbFile });

export default async function vercelHandler(req, res) {
  return handler(req, res);
}
