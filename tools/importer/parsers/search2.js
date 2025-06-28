/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search section (should contain visible search input and text)
  let searchDiv = null;
  const grid = element.querySelector('.aem-Grid');
  if (grid) {
    // Find the immediate child that is likely the search block
    searchDiv = Array.from(grid.children)
      .find((child) => child.classList && Array.from(child.classList).some(cls => cls.includes('cmp-search')));
  }
  if (!searchDiv) {
    // fallback: try to find any cmp-search block in element
    searchDiv = element.querySelector('[class*="cmp-search"]');
  }

  let cellContent = '';
  if (searchDiv) {
    // Reference the actual searchDiv content (including all text, structure, and children)
    cellContent = searchDiv;
  }

  const cells = [
    ['Search'],
    [cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
