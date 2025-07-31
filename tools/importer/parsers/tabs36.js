/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the list (li elements inside .cmp-tabs__tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panel containers - order should match tab labels
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Prepare the cells array for the table
  // First row: header with block name and variant
  const cells = [
    ['Tabs (tabs36)'],
  ];

  // For each tab, create a row: [Tab Label, Tab Content]
  tabPanels.forEach((panel, i) => {
    // The tab label for this panel
    const label = tabLabels[i] || '';
    // The content of the tab: include everything inside the tab panel
    // Reference the actual children, not their HTML
    // Remove empty text nodes
    let tabContent = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    // If only one node, don't wrap in array
    const cellContent = tabContent.length === 1 ? tabContent[0] : tabContent;
    cells.push([label, cellContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the block table
  tabsBlock.replaceWith(table);
}
