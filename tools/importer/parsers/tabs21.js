/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')).map(tab => tab.textContent.trim());

  // Get the tab panels (content for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row (block name exactly as required, single cell)
  const headerRow = ['Tabs (tabs21)'];

  // Each tab gets a row: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, i) => {
    let contentRoot = null;
    const tabPanel = tabPanels[i];
    if (tabPanel) {
      // Find first element child, else fallback to panel itself
      for (const child of tabPanel.childNodes) {
        if (child.nodeType === 1) {
          contentRoot = child;
          break;
        }
      }
      if (!contentRoot) contentRoot = tabPanel;
    }
    return [label, contentRoot];
  });

  // Compose the cells array
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
