/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the <ol> list
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (one per tab, in the same order as labels)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Sanity check: if there's a mismatch in count, bail out (edge case handling)
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Compose the table rows
  const rows = [];
  // Header row - matches example exactly
  rows.push(['Tabs (tabs17)']);

  // Each subsequent row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Always trim and use existing node for label
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Prefer grabbing the entire .contentfragment if present (preserves all formatting, headings, images, lists)
      tabContent = panel.querySelector('.contentfragment') || panel;
    }
    // Defensive: always push a valid row (even if one column missing, don't break)
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original block element
  element.replaceWith(block);
}
