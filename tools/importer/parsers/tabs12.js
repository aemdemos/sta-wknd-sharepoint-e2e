/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order
  const tabLabelsList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabLabelsList ? tabLabelsList.querySelectorAll('[role="tab"]') : []);

  // Get all tab content panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only as many panels as there are labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build header as required
  const headerRow = ['Tabs (tabs12)'];

  // Build tab names row: preserve formatting with <strong>
  const tabNamesRow = [];
  for (let i = 0; i < tabCount; i++) {
    const tabLabel = tabLabels[i];
    const strong = document.createElement('strong');
    strong.textContent = tabLabel.textContent.trim();
    tabNamesRow.push(strong);
  }

  // Build tab content row: reference the contentfragment/article or panel contents
  const tabContentsRow = [];
  for (let i = 0; i < tabCount; i++) {
    const panel = tabPanels[i];
    // Try to find a .cmp-contentfragment inside the panel
    let content = panel.querySelector('article.cmp-contentfragment');
    if (!content) {
      // fallback: use first .contentfragment or all children
      content = panel.querySelector('.contentfragment') || panel;
    }
    tabContentsRow.push(content);
  }

  // Compose the table for the block
  const cells = [
    headerRow,
    tabNamesRow,
    tabContentsRow
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire tabs container (the outer .tabs) with the new block table
  const tabsContainer = element.querySelector('.tabs');
  if (tabsContainer) {
    tabsContainer.replaceWith(blockTable);
  }
}
