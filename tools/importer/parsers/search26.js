/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row for this block
  const headerRow = ['Search (search26)'];

  // The second row must contain the absolute URL to the query index
  // This is static for this block type, per the instructions and example
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const secondRow = [queryIndexUrl];

  // Build the table cells array
  const cells = [
    headerRow,
    secondRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
