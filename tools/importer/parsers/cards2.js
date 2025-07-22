/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) expects: each row = Card: [Image, Text]
  // This header block has three areas: logo (left), navigation (center), search (right)
  // We treat each area as a 'card', so there will be up to 3 data rows after the header (2 columns per row)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const children = Array.from(grid.children);
  // Helper to safely get the desired element
  function findChildWith(sel) {
    const col = children.find(child => child.querySelector(sel));
    return col ? col.querySelector(sel) : null;
  }
  // Cards: left (logo), center (nav), right (search)
  const logo = findChildWith('.cmp-image');
  const nav = findChildWith('nav.cmp-navigation');
  const search = findChildWith('.cmp-search');
  // Compose rows (skip missing ones, always keep order: logo, nav, search)
  const rows = [['Cards (cards2)']];
  if (logo) rows.push([logo]);
  if (nav) rows.push([nav]);
  if (search) rows.push([search]);
  // But Cards (cards2) expects 2 columns per row: card image (icon), card text
  // In header, only logo is an actual image; navigation/search are text/fields
  // So: If navigation or search is present, their image cell is blank, text cell is the content
  // For logo, image cell is logo block, text cell is blank
  const finalRows = [rows[0]];
  if (logo) finalRows.push([logo, '']);
  if (nav) finalRows.push(['', nav]);
  if (search) finalRows.push(['', search]);
  const table = WebImporter.DOMUtils.createTable(finalRows, document);
  element.replaceWith(table);
}
