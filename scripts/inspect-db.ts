import { db } from '../server/db.js';

const variants = db.prepare('SELECT id, character_id, name_ja, status, notes FROM costume_variants').all();
console.log('Variants (' + variants.length + '):', JSON.stringify(variants, null, 2));

const images = db.prepare('SELECT id, variant_id, category, file_path, caption, is_primary FROM costume_images').all();
console.log('Images (' + images.length + '):', JSON.stringify(images, null, 2));

const sources = db.prepare('SELECT id, variant_id, source_type, title, detail FROM costume_sources').all();
console.log('Sources (' + sources.length + '):', JSON.stringify(sources, null, 2));
