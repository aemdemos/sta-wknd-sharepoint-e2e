/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row as required by spec
  const headerRow = ['Tabs (tabs20)'];

  // Build tab rows
  const tabRows = tabLabels.map((tabLabel, idx) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    if (!panel) return null;

    // Find the main contentfragment/article inside the panel (if present)
    let tabContent = panel.querySelector('.cmp-contentfragment') || panel;

    // Defensive: If content is empty, insert an empty div
    if (!tabContent || !tabContent.innerHTML.trim()) {
      tabContent = document.createElement('div');
    }

    // Reference the existing content node (do not clone)
    return [label, tabContent];
  }).filter(Boolean);

  // Compose table
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  element.replaceWith(block);
}
