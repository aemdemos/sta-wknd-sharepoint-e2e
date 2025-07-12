/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (left column)
  let mainContent = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  if (!mainContent) {
    const mains = element.querySelectorAll('main');
    for (const m of mains) {
      if (m.querySelector('article')) {
        mainContent = m;
        break;
      }
    }
  }
  if (!mainContent) mainContent = document.createElement('div');

  // Find the sidebar (right column)
  let sidebar = element.querySelector('aside.container.responsivegrid.cmp-layoutcontainer--sidebar');
  if (!sidebar) {
    sidebar = element.querySelector('aside');
  }
  if (!sidebar) sidebar = document.createElement('div');

  // Header row: only one column, per the example
  const headerRow = ['Columns'];
  // Content row: two columns (main, sidebar)
  const contentRow = [mainContent, sidebar];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
