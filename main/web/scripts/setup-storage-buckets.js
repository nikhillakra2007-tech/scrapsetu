/**
 * Kabadiwala Connect (ScrapSetu) — Storage Bucket Setup Script
 * Creates the required Supabase storage buckets with appropriate public access and size limits.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      const val = vals.join('=').replace(/^["']|["']$/g, '');
      if (key && val && !process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes('your-supabase-service-role-key')) {
  console.error('[✗] Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const REQUIRED_BUCKETS = [
  {
    id: 'lot-images',
    name: 'lot-images',
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
    description: 'Scrap lot photos captured by collectors for Gemini multimodal inspection and recycler view',
  },
  {
    id: 'handover-photos',
    name: 'handover-photos',
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    description: 'Weighbridge scale reading and physical material handover audit verification photos',
  },
  {
    id: 'pickup-photos',
    name: 'pickup-photos',
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    description: 'Household and bulk generator e-waste pickup request photos',
  },
  {
    id: 'safety-media',
    name: 'safety-media',
    public: true,
    fileSizeLimit: 20971520, // 20MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'audio/mpeg', 'audio/wav', 'audio/webm'],
    description: 'Pictorial hazard safety guides, infographics, and vernacular audio clips (Hindi/Marathi)',
  },
];

async function setupBuckets() {
  console.log('==================================================================');
  console.log('  SCRAPSETU — SUPABASE STORAGE BUCKET INITIALIZATION');
  console.log('==================================================================');
  console.log(`[*] Target Project: ${supabaseUrl}`);

  // Fetch existing buckets
  const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error(`[✗] Failed to list existing buckets: ${listError.message}`);
    process.exit(1);
  }

  const existingBucketIds = new Set((existingBuckets || []).map((b) => b.id));
  console.log(`[*] Existing buckets in project: [${Array.from(existingBucketIds).join(', ') || 'none'}]\n`);

  for (const bucket of REQUIRED_BUCKETS) {
    if (existingBucketIds.has(bucket.id)) {
      console.log(`[✓] Bucket '${bucket.id}' already exists. Ensuring public access...`);
      const { error: updateError } = await supabase.storage.updateBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes,
      });
      if (updateError) {
        console.warn(`    [!] Update warning for '${bucket.id}': ${updateError.message}`);
      } else {
        console.log(`    [✓] Configuration verified.`);
      }
    } else {
      console.log(`[+] Creating bucket '${bucket.id}'...`);
      const { data, error: createError } = await supabase.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes,
      });

      if (createError) {
        console.error(`[✗] Failed to create bucket '${bucket.id}': ${createError.message}`);
      } else {
        console.log(`[✓] Successfully created public bucket '${bucket.id}'! (${bucket.description})`);
      }
    }
  }

  console.log('\n==================================================================');
  console.log('  STORAGE SETUP COMPLETE');
  console.log('==================================================================');

  // Verify final list
  const { data: finalBuckets } = await supabase.storage.listBuckets();
  console.log('Active Storage Buckets:');
  (finalBuckets || []).forEach((b) => {
    console.log(`  - ${b.id} (public: ${b.public})`);
  });
}

setupBuckets().catch((err) => {
  console.error('[✗] Unexpected error:', err);
  process.exit(1);
});
