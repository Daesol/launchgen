import { createClient } from '@supabase/supabase-js';

// Use the same environment variables as your app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateThemeColors() {
  console.log('Starting theme colors migration...');
  console.log('Using Supabase URL:', supabaseUrl);
  
  const { data: pages, error } = await supabase
    .from('landing_pages')
    .select('id, page_style');

  if (error) {
    console.error('Error fetching pages:', error);
    return;
  }

  console.log(`Found ${pages?.length || 0} pages to check`);

  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const page of pages || []) {
    const style = page.page_style;
    if (style && style.themeColors) {
      console.log(`Migrating page ${page.id}...`);
      
      // Migrate to new theme structure
      const themeColors = style.themeColors;
      const newTheme = {
        mode: 'white', // Default to white theme
        accentColor: themeColors.accentColor || themeColors.primaryColor || '#6366f1',
      };
      
      // Remove old themeColors and add new theme
      delete style.themeColors;
      style.theme = newTheme;

      // Update the record
      const { error: updateError } = await supabase
        .from('landing_pages')
        .update({ page_style: style })
        .eq('id', page.id);

      if (updateError) {
        console.error(`Failed to update page ${page.id}:`, updateError);
        errorCount++;
      } else {
        console.log(`✓ Migrated page ${page.id}`);
        migratedCount++;
      }
    } else {
      console.log(`Skipping page ${page.id} - no themeColors found`);
      skippedCount++;
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`- Migrated: ${migratedCount} pages`);
  console.log(`- Skipped: ${skippedCount} pages`);
  console.log(`- Errors: ${errorCount} pages`);
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some pages failed to migrate. You may need to use the service role key for full access.');
  }
}

migrateThemeColors().catch(console.error); 