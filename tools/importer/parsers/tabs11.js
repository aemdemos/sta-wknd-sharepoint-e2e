/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // Get tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row: exactly one column as per spec
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];

  // For each tab, add a row with [label, content]
  for (let i = 0; i < Math.max(tabLabels.length, tabPanels.length); i++) {
    // Get tab label
    let label = '';
    if (tabLabels[i]) {
      label = tabLabels[i].textContent.trim();
    }
    // Get content: Try to use article if available, else panel
    let panel = tabPanels[i] || document.createElement('div');
    let contentEl = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
    // If contentEl is still the panel, but empty, use an empty string
    if ((contentEl === panel) && !panel.textContent.trim()) {
      contentEl = '';
    }
    rows.push([label, contentEl]);
  }

  // Create the table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
