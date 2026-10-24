import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { openapi } from '../src/docs/openapi';

writeFileSync(path.resolve(__dirname, '../openapi.json'), JSON.stringify(openapi, null, 2) + '\n');
console.log('openapi.json נוצר');
