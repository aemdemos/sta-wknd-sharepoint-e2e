/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (same order as tabLabels)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row must be a single cell, as per requirements
  const headerRow = ['Tabs (tabs13)'];

  // Prepare table rows for each tab (label, content)
  const tabRows = tabLabels.map((tabLabel, idx) => {
    const labelText = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    let tabContent = null;
    const contentFragment = panel && panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else if (panel) {
      tabContent = panel;
    } else {
      tabContent = document.createElement('div');
    }
    return [labelText, tabContent];
  });

  // Compose the cells array for the block table: first row = 1 cell (header), subsequent rows = 2 cells (label, content)
  const cells = [headerRow, ...tabRows];

  // Create the block table using referenced elements
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
