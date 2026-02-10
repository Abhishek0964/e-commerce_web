/**
 * MeiliSearch Index Configuration for ShopHub E-commerce
 * Optimized for product search and discovery
 */

export const PRODUCTS_INDEX_CONFIG = {
    // Index identifier
    uid: 'products',

    // Primary key for documents
    primaryKey: 'id',

    // Searchable attributes - fields that will be searched
    // Order matters! Earlier fields have higher importance
    searchableAttributes: [
        'name',           // Product name - highest priority
        'description',    // Product description
        'category',       // Category name
        'brand',          // Brand name
        'tags',           // Product tags
        'sku'             // SKU for exact matches
    ],

    // Displayed attributes - fields returned in search results
    displayedAttributes: [
        'id',
        'name',
        'description',
        'price',
        'comparePrice',
        'category',
        'brand',
        'image',
        'images',
        'inStock',
        'stock',
        'rating',
        'reviewCount',
        'tags',
        'slug'
    ],

    // Filterable attributes - fields that can be used for filtering
    filterableAttributes: [
        'category',
        'brand',
        'price',
        'inStock',
        'rating',
        'tags',
        'createdAt'
    ],

    // Sortable attributes
    sortableAttributes: [
        'price',
        'rating',
        'createdAt',
        'name',
        'reviewCount'
    ],

    // Ranking rules - defines how results are ranked
    // Built-in rules: words, typo, proximity, attribute, sort, exactness
    rankingRules: [
        'words',          // Number of query words matched
        'typo',           // Fewer typos = better rank
        'proximity',      // Proximity of query words in document
        'attribute',      // Earlier attributes from searchableAttributes
        'sort',           // Custom sorting
        'exactness'       // Exact matches ranked higher
    ],

    // Typo tolerance - allows fuzzy matching
    typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
            oneTypo: 4,     // Allow 1 typo for words >= 4 chars
            twoTypos: 8     // Allow 2 typos for words >= 8 chars
        },
        disableOnWords: [],
        disableOnAttributes: ['sku'] // Exact match required for SKU
    },

    // Synonyms for better search results
    synonyms: {
        'phone': ['mobile', 'smartphone', 'cellphone'],
        'laptop': ['notebook', 'computer'],
        'tv': ['television', 'smart tv'],
        'headphone': ['earphone', 'earbud', 'headset'],
        'shoe': ['footwear', 'sneaker', 'boot'],
        'shirt': ['tshirt', 't-shirt', 'top']
    },

    // Stop words - common words to ignore
    stopWords: ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'],

    // Distinct attribute - prevent duplicate results
    distinctAttribute: 'id',

    // Pagination settings
    pagination: {
        maxTotalHits: 1000
    }
};

export const INDEX_SETTINGS_SUMMARY = {
    description: 'Optimized product search index for e-commerce',
    features: [
        'Typo-tolerant search',
        'Synonym support for common terms',
        'Multi-field search (name, description, category)',
        'Filterable by price, category, brand, stock',
        'Sortable by price, rating, date',
        'Relevance-based ranking'
    ],
    performance: {
        searchTime: '< 50ms',
        indexSize: 'Depends on product count',
        recommended: 'Reindex after bulk updates'
    }
};
