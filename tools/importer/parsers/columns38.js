/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main and sidebar containers
  let main = element.querySelector('main.container');
  let aside = element.querySelector('aside.container');

  // Fallbacks if not found
  if (!main) main = element.querySelector('main');
  if (!aside) aside = element.querySelector('aside');

  // Defensive: fallback to children if still not found
  if (!main || !aside) {
    const children = Array.from(element.children);
    if (!main) main = children.find((el) => el.tagName === 'MAIN') || children[0];
    if (!aside) aside = children.find((el) => el.tagName === 'ASIDE') || children[1];
  }

  // Compose the columns: left is the main article, right is the sidebar
  // For main: get the main article contentfragment
  let mainContent = main.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!mainContent) mainContent = main;
  // For sidebar: use the entire aside
  let sidebarContent = aside;

  // The header row
  const headerRow = ['Columns (columns38)'];

  // The columns row
  const row = [mainContent, sidebarContent];

  // Compose the table
  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
