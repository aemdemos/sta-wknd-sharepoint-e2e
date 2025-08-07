/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab component within the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels (in order)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabItems = Array.from(tabList ? tabList.children : []);
  const tabLabels = tabItems.map(li => li.textContent.trim());
  const numTabColumns = 2; // Tabs block is always 2 columns (label, content)

  // Get the tab panels (in order)
  const tabPanelNodes = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: first row is header (ONE CELL only), then each row: [label, content]
  const rows = [];
  // Header row: one cell with correct colspan attribute set after table creation
  rows.push(['Tabs (tabs13)']);

  // For each tab, add the row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let contentElem = '';
    if (tabPanelNodes[i]) {
      // Reference all child nodes (preserving elements)
      const panel = tabPanelNodes[i];
      const fragment = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(node => {
        if (node.nodeType === 3 && !node.textContent.trim()) return;
        if (node.nodeType === 1 && node.matches('div.aem-Grid') && node.childElementCount === 0) return;
        fragment.appendChild(node);
      });
      contentElem = Array.from(fragment.childNodes);
    }
    rows.push([label, contentElem]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Fix the first row to have exactly one th with colspan=2
  const firstRow = table.querySelector('tr');
  if (firstRow) {
    // Remove all children
    while (firstRow.firstChild) firstRow.removeChild(firstRow.firstChild);
    const th = document.createElement('th');
    th.textContent = 'Tabs (tabs13)';
    th.setAttribute('colspan', numTabColumns);
    firstRow.appendChild(th);
  }

  // Replace the tabsRoot with the block table
  tabsRoot.replaceWith(table);
}
