/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsEl = element.querySelector('.tabs .cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels
  const tabLabels = [];
  const tablist = tabsEl.querySelector('.cmp-tabs__tablist');
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels in corresponding order
  const tabPanels = Array.from(tabsEl.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build table rows
  const cells = [];
  // Header row (one cell)
  cells.push(['Tabs (tabs17)']);
  // Each tab: one row, [label, content]
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Use contentfragment if available, else panel
    let content = panel.querySelector('.cmp-contentfragment');
    if (!content) content = panel;
    cells.push([label, content]);
  }
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  const tabsContainer = element.querySelector('.tabs');
  if (tabsContainer) {
    tabsContainer.replaceWith(table);
  }
}
