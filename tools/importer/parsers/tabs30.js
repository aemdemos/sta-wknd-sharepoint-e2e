/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Find tab labels and their order
  const tabItems = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find tab panels in the same order
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (!tabItems.length || !tabPanels.length) return;

  // Header row - exactly one column!
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, create a row: a single array containing an array of [label, content]
  for (let i = 0; i < tabItems.length; i++) {
    const label = tabItems[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let content = null;
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      content = panel;
    }
    // Each tab row is a single cell containing [label, content]
    rows.push([[label, content]]);
  }

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
