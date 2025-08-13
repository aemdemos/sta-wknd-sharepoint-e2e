/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract the tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll(':scope > li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract the tab contents (tab panels)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Build the table rows
  const cells = [];
  // Header row: only one column
  cells.push(['Tabs (tabs8)']);
  // Each tab row: [tab label, tab content]
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    // Use article inside the tabpanel if available, else panel itself
    let contentEl = panel.querySelector('article') || panel;
    cells.push([label, contentEl]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
