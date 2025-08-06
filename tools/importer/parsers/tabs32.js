/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element within the current block/element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Header row as specified in the task
  const headerRow = ['Tabs (tabs32)'];

  // Get all tab labels (the tab navigation)
  const tabLabelElements = tabsEl.querySelectorAll('.cmp-tabs__tablist > li');

  // Get all tab panels (the tab contents, in the same order as labels)
  const tabPanels = tabsEl.querySelectorAll('.cmp-tabs__tabpanel');

  // Prepare rows for each tab
  const tabRows = [];
  // The number of tab labels and tabPanels should be equal, but be defensive
  for (let i = 0; i < tabLabelElements.length; i++) {
    const label = tabLabelElements[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Find the main content fragment for the panel if exists, or fallback to panel itself
    // This will include all headings, images, paragraphs, lists etc, preserving the original structure
    const cf = panel.querySelector('.contentfragment') || panel;
    tabRows.push([label, cf]);
  }

  // Only construct the table if at least one tab row exists
  if (tabRows.length > 0) {
    const cells = [headerRow, ...tabRows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
