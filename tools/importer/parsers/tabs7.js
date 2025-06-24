/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container (cmp-tabs)
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (textContent)
  const tabList = tabsContainer.querySelector('[role="tablist"]');
  const tabEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabEls.map(tabEl => tabEl.textContent.trim());

  // Get tab panels (content)
  const tabPanelEls = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: only as many tab panels as tab labels
  const numTabs = Math.min(tabLabels.length, tabPanelEls.length);

  // Build header row (block name exactly as required)
  const headerRow = ['Tabs (tabs7)'];

  // Each subsequent row: [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < numTabs; i++) {
    // First cell: tab label as string
    // Second cell: reference the existing tab panel element (retains all inner HTML/structure)
    rows.push([
      tabLabels[i],
      tabPanelEls[i]
    ]);
  }

  // Compose table:
  //   first row: header, then one row per tab (label | content)
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
