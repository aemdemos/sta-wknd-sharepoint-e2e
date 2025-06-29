/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels in order
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tabpanel elements, in DOM order, in case order matches the tab order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Compose the block table: header, then label/content rows
  const cells = [
    ['Tabs (tabs16)']
  ];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const content = tabPanels[i];
    if (label && content) {
      cells.push([label, content]);
    }
  }

  // Create the block table and replace the tabs block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
