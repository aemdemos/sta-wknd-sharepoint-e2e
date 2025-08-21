/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Tab content panels, order should match tabLabels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Use .contentfragment inside each tabpanel if available, otherwise the panel itself
  const tabContents = tabPanels.map(panel => {
    const content = panel.querySelector('.contentfragment');
    return content || panel;
  });

  // Compose the block table with the correct structure
  const cells = [
    ['Tabs (tabs28)'],         // Header row (single cell)
    tabLabels,                // Labels row (one cell per tab)
    tabContents               // Content row (one cell per tab)
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
