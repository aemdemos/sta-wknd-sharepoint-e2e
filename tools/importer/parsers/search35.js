/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Search (search35)'];

  // The second row must contain the absolute URL to the query index
  // Try to find a query index url in the source html, fallback to the canonical sample index URL
  let queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  // Try to find a likely query index url in the page
  const links = element.querySelectorAll('a, [href]');
  for (const link of links) {
    const href = link.href || link.getAttribute('href');
    if (href && href.includes('query-index.json')) {
      queryIndexUrl = href;
      break;
    }
  }

  const urlRow = [queryIndexUrl];

  // Compose the table
  const cells = [
    headerRow,
    urlRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
