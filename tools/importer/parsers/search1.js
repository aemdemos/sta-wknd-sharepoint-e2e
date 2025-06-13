/* global WebImporter */
export default function parse(element, { document }) {
  // Only 2 rows: header, then the query index URL for the search block as plain text (not a link)
  const cells = [
    ['Search (search1)'],
    ['https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json'],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
