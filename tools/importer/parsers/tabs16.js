/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab block/component
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }
  // Get tab panels in order
  const tabPanels = tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // For each tab panel, extract its content as a single element (for resilience to structure changes)
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if no panel for this label
    if (!panel) continue;
    // Move all children of the panel to a new div (preserving existing elements, not cloning)
    const tabContentDiv = document.createElement('div');
    while (panel.childNodes.length > 0) {
      tabContentDiv.appendChild(panel.childNodes[0]);
    }
    rows.push([label, tabContentDiv]);
  }
  // Build the block table
  const cells = [
    ['Tabs (tabs16)'],
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
