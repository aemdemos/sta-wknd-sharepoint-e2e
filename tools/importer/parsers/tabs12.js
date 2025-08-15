/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // 1. Extract tab labels from tablist
  const tabLabelNodes = tabsBlock.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]');
  const tabLabels = Array.from(tabLabelNodes).map(li => li.textContent.trim());

  // 2. Extract tab content panels, matching order of labels
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Ensure the number of tabPanels matches tabLabels
  // If they don't match, fill with nulls (empty cell)
  const contentCells = tabLabels.map((lbl, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return '';
    // Prefer contentfragment/article, or else the whole panel
    const mainContent = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel.firstElementChild || panel;
    return mainContent;
  });

  // Table rows
  // Header row: block name as per instruction
  const headerRow = ['Tabs (tabs12)'];
  // Second row: tab labels (1 per column)
  // Third row: tab content for each tab label (1 per column)
  const cells = [headerRow, tabLabels, contentCells];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original tabs block with the block table
  tabsBlock.replaceWith(block);
}
