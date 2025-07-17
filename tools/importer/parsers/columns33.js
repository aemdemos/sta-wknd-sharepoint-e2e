/* global WebImporter */
export default function parse(element, { document }) {
  // Find main and sidebar columns
  let mainColumn = null;
  let sidebarColumn = null;

  const allMains = element.querySelectorAll('main');
  for (const m of allMains) {
    if (m.querySelector('article.cmp-contentfragment')) {
      mainColumn = m;
    }
    if (!sidebarColumn && (m.classList.contains('cmp-layoutcontainer--sidebar') || m.querySelector('.cmp-layoutcontainer--sidebar'))) {
      sidebarColumn = m;
    }
  }
  if (!sidebarColumn) {
    sidebarColumn = element.querySelector('aside');
  }

  // Gather left column content
  let mainColContent = [];
  if (mainColumn) {
    const container = mainColumn.querySelector('.cmp-container');
    if (container) {
      const h1 = container.querySelector('.cmp-title h1');
      if (h1) mainColContent.push(h1);
      const h4 = container.querySelector('.cmp-title h4');
      if (h4) mainColContent.push(h4);
      const cf = container.querySelector('article.cmp-contentfragment');
      if (cf) mainColContent.push(cf);
    }
  }

  // Gather right column content
  let sidebarColContent = [];
  if (sidebarColumn) {
    let sidebarContainer = sidebarColumn.querySelector('.cmp-container');
    if (!sidebarContainer) sidebarContainer = sidebarColumn;
    Array.from(sidebarContainer.children).forEach(child => {
      if (child.children.length > 0 || child.textContent.trim().length > 0) {
        sidebarColContent.push(child);
      }
    });
  }

  // Correct structure: header (single cell), then row with 2 columns
  // We'll use createTable for the body, but then manually fix the header row
  const cells = [
    // Only one cell in the header row
    ['Columns (columns33)'],
    // Content row: two columns
    [mainColContent, sidebarColContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix the header row to have colspan equal to the number of columns in the content row
  const headerRow = table.querySelector('tr');
  if (headerRow && headerRow.children.length === 1 && table.rows.length > 1) {
    headerRow.children[0].setAttribute('colspan', table.rows[1].children.length);
  }

  element.replaceWith(table);
}
