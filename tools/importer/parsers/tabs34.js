/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Header row (must match the example: single cell)
  const rows = [['Tabs (tabs34)']];

  // Get all tab labels
  const tabLabels = [];
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (tab content), in order
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // For each tab label and its corresponding content, create a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: if tabPanels[i] is undefined, put empty string
    rows.push([
      tabLabels[i] || '',
      tabPanels[i] || ''
    ]);
  }

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsContainer.replaceWith(table);
}
