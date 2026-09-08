import { writeFileSync } from 'node:fs';
import { buildCloudflareRedirectsFile } from '../src/lib/seo/legacy-redirects.ts';

const outPath = new URL('../public/_redirects', import.meta.url);
writeFileSync(outPath, buildCloudflareRedirectsFile());
console.log('Wrote public/_redirects');
