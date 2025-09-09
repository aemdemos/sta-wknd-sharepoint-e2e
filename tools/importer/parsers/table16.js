/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Table (table16)'];
  const rows = [headerRow];

  // Find the main content fragment article (where the surf spots are listed)
  const cf = element.querySelector('.cmp-contentfragment');
  if (cf) {
    // Get all h2s (spot names) and their following p (description)
    const h2s = cf.querySelectorAll('h2');
    h2s.forEach(h2 => {
      // Spot name
      const name = h2.textContent.trim();
      // Find the next p sibling (skip grids/divs)
      let desc = '';
      let next = h2.nextSibling;
      while (next && (next.nodeType !== 1 || next.tagName !== 'P')) {
        next = next.nextSibling;
      }
      if (next && next.nodeType === 1 && next.tagName === 'P') {
        desc = next.textContent.trim();
      }
      if (name && desc) {
        rows.push([name, desc]);
      }
    });
  }

  // If no rows were found, try to get all text content from the content fragment
  if (rows.length === 1 && cf) {
    const allText = cf.textContent.trim();
    if (allText) {
      rows.push([allText]);
    }
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
