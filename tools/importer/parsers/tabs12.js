/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Ensure same number of tabs and panels to avoid misalignment
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Prepare header row as required by the block definition
  const headerRow = ['Tabs (tabs12)'];
  const tableRows = [headerRow];

  for (let i = 0; i < count; i++) {
    // Tab label
    const label = tabLabels[i]?.textContent?.trim() || '';

    // Tab panel content: reference the main meaningful element in the tabpanel, if present
    let content;
    const panel = tabPanels[i];
    // Skip empty tabpanels
    if (!panel) {
      tableRows.push([label, '']);
      continue;
    }
    // If the panel has only one child and it's a contentfragment, reference that, else reference the panel itself
    if (
      panel.children.length === 1 &&
      panel.children[0].classList &&
      panel.children[0].classList.contains('contentfragment')
    ) {
      content = panel.children[0];
    } else {
      content = panel;
    }
    tableRows.push([label, content]);
  }

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  tabs.replaceWith(block);
}
