/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the given element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels from the tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (contents), in DOM order
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table rows
  const rows = [];
  // Header row: for a 2-column table, the header row should have 1 cell with colspan=2
  const headerCell = document.createElement('th');
  headerCell.textContent = 'Tabs (tabs36)';
  headerCell.colSpan = 2;
  const headerRow = [headerCell];
  rows.push(headerRow);

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || `Tab ${i + 1}`;
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Try to find the main contentfragment__elements block for clean content
      const cf = panel.querySelector('.cmp-contentfragment__elements');
      if (cf) {
        content = cf;
      } else {
        // fallback: use the entire panel
        content = panel;
      }
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabsContainer with our table
  tabsContainer.replaceWith(table);
}
