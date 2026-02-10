#!/usr/bin/env node

/**
 * MeiliSearch Reindexing Script
 * 
 * Fetches all active products from Supabase and indexes them into MeiliSearch.
 * Usage: node scripts/meilisearch/reindex-from-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const { MeiliSearch } = require('meilisearch');

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MEILI_HOST = process.env.MEILI_HOST || 'http://localhost:7700';
const MEILI_KEY = process.env.MEILI_MASTER_KEY;

// Index name
const INDEX_NAME = 'products';

async function main() {
    console.log('🔄 Starting MeiliSearch reindexing...\n');

    // Validate environment variables
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error('❌ Missing Supabase credentials');
        console.error('   Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
        process.exit(1);
    }

    if (!MEILI_HOST || !MEILI_KEY) {
        console.error('❌ Missing MeiliSearch credentials');
        console.error('   Required: MEILI_HOST, MEILI_MASTER_KEY');
        process.exit(1);
    }

    const startTime = Date.now();

    try {
        // Initialize clients
        console.log(`📡 Connecting to Supabase: ${SUPABASE_URL}`);
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        console.log(`📡 Connecting to MeiliSearch: ${MEILI_HOST}`);
        const meili = new MeiliSearch({
            host: MEILI_HOST,
            apiKey: MEILI_KEY,
        });

        // Test MeiliSearch connection
        const health = await meili.health();
        console.log(`✅ MeiliSearch is ${health.status}\n`);

        // Fetch products from Supabase
        console.log('📥 Fetching products from Supabase...');
        const { data: products, error } = await supabase
            .from('products')
            .select(`
        id,
        name,
        slug,
        description,
        price,
        compare_price,
        available_stock,
        sku,
        tags,
        is_featured,
        is_active,
        created_at,
        category_id,
        category:categories(id, name, slug),
        images:product_images(id, image_url, alt_text, display_order)
      `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error fetching products:', error.message);
            process.exit(1);
        }

        if (!products || products.length === 0) {
            console.log('⚠️  No active products found in database');
            process.exit(0);
        }

        console.log(`✅ Fetched ${products.length} products\n`);

        // Transform products for MeiliSearch
        const documents = products.map(product => {
            // Sort images by display_order
            const sortedImages = (product.images || []).sort(
                (a, b) => (a.display_order || 0) - (b.display_order || 0)
            );

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description || '',
                price: product.price,
                comparePrice: product.compare_price || null,
                stock: product.available_stock || 0,
                inStock: (product.available_stock || 0) > 0,
                sku: product.sku || '',
                tags: product.tags || [],
                isFeatured: product.is_featured || false,
                categoryId: product.category_id || null,
                categoryName: product.category?.name || '',
                categorySlug: product.category?.slug || '',
                imageUrl: sortedImages[0]?.image_url || '',
                imageUrls: sortedImages.map(img => img.image_url),
                createdAt: new Date(product.created_at).getTime(), // Unix timestamp for sorting
            };
        });

        // Index documents in MeiliSearch
        console.log(`📤 Indexing ${documents.length} documents to '${INDEX_NAME}' index...`);

        const index = meili.index(INDEX_NAME);
        const task = await index.addDocuments(documents, { primaryKey: 'id' });

        console.log(`✅ Indexing task enqueued: ${task.taskUid}`);
        console.log('⏳ Waiting for indexing to complete...\n');

        // Wait for task completion
        const finalTask = await meili.waitForTask(task.taskUid);

        if (finalTask.status === 'succeeded') {
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log('✅ Reindexing complete!');
            console.log(`📊 Stats:`);
            console.log(`   - Products indexed: ${documents.length}`);
            console.log(`   - Duration: ${duration}s`);
            console.log(`   - Task UID: ${finalTask.uid}`);
        } else if (finalTask.status === 'failed') {
            console.error('❌ Indexing failed:', finalTask.error);
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error during reindexing:', error.message);
        if (error.stack) {
            console.error('\nStack trace:');
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Run the script
main();
