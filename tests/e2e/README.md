# E2E Tests for ShopHub

## Overview
Playwright tests covering core user flows for the e-commerce platform.

## Tests Included
1. Homepage load
2. Search functionality
3. Product listing page
4. Product detail page
5. Add to cart flow
6. Cart viewing
7. Checkout navigation
8. Authentication flow

## Running Tests

\`\`\`bash
# Install Playwright (if not installed)
npm install -D @playwright/test
npx playwright install

# Run all tests
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific test
npx playwright test tests/e2e/core-flows.spec.ts

# Debug mode
npx playwright test --debug
\`\`\`

## Configuration
Tests use \`BASE_URL\` from environment or default to \`http://localhost:3000\`.

Set in \`.env.local\`:
\`\`\`
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`
