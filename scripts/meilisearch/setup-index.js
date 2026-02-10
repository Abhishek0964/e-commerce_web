#!/usr/bin/env node

/**
 * MeiliSearch Index Setup Script
 * Applies optimized configuration to products index
 */

const MEILI_HOST = process.env.MEILI_HOST || 'http://localhost:7700';
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY;

const { PRODUCTS_INDEX_CONFIG } = require('./index-config');

async function setupIndex() {
    console.log('🔍 MeiliSearch Index Setup');
    console.log('Host:', MEILI_HOST);

    const MeiliSearch = (await import('meilisearch')).MeiliSearch;
    const client = new MeiliSearch({
        host: MEILI_HOST,
        apiKey: MEILI_MASTER_KEY
    });

    try {
        // Check server health
        const health = await client.health();
        console.log('✅ Server is healthy:', health.status);

        // Create or update products index
        console.log('\n📦 Setting up products index...');

        const index = client.index(PRODUCTS_INDEX_CONFIG.uid);

        // Update searchable attributes
        await index.updateSearchableAttributes(PRODUCTS_INDEX_CONFIG.searchableAttributes);
        console.log('✅ Searchable attributes updated');

        // Update filterable attributes
        await index.updateFilterableAttributes(PRODUCTS_INDEX_CONFIG.filterableAttributes);
        console.log('✅ Filterable attributes updated');

        // Update sortable attributes
        await index.updateSortableAttributes(PRODUCTS_INDEX_CONFIG.sortableAttributes);
        console.log('✅ Sortable attributes updated');

        // Update ranking rules
        await index.updateRankingRules(PRODUCTS_INDEX_CONFIG.rankingRules);
        console.log('✅ Ranking rules updated');

        // Update typo tolerance
        await index.updateTypoTolerance(PRODUCTS_INDEX_CONFIG.typoTolerance);
        console.log('✅ Typo tolerance updated');

        // Update synonyms
        await index.updateSynonyms(PRODUCTS_INDEX_CONFIG.synonyms);
        console.log('✅ Synonyms updated');

        // Update stop words
        await index.updateStopWords(PRODUCTS_INDEX_CONFIG.stopWords);
        console.log('✅ Stop words updated');

        // Get final settings
        const settings = await index.getSettings();
        console.log('\n📊 Final Index Settings:');
        console.log(JSON.stringify(settings, null, 2));

        console.log('\n✨ Index setup complete!');

    } catch (error) {
        console.error('❌ Error setting up index:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    setupIndex();
}

module.exports = { setupIndex };
