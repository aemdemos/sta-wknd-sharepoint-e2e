/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name and variant as the header row
  const headerRow = ['Search (search39)'];

  // The second row must contain the absolute URL to the query index
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const secondRow = [queryIndexUrl];

  // Compose the table data
  const cells = [
    headerRow,
    secondRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
