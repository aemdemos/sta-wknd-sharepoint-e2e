/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block inside the provided element
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels in order
  const tabLabels = [];
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tabEl => {
      tabLabels.push(tabEl.textContent.trim());
    });
  }

  // Extract tab panels in order
  const tabPanels = [];
  tabsContainer.querySelectorAll('.cmp-tabs__tabpanel').forEach(panel => {
    tabPanels.push(panel);
  });

  // Defensive: Handle mismatch in tab labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build the cells array for the block table
  // Header row: block name exactly as required
  const cells = [ ['Tabs (tabs26)'] ];

  // For each tab, add a row: [Tab Label, Tab Content Element]
  for (let i = 0; i < numTabs; i++) {
    // Defensive: skip empty label or panel
    if (!tabLabels[i] || !tabPanels[i]) continue;
    cells.push([
      tabLabels[i],
      tabPanels[i]
    ]);
  }

  // Create the block table and replace the original tabs block with it
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsContainer.replaceWith(table);
}
