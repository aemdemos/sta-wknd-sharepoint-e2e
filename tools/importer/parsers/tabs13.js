/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Find the tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Step 2: Get the tab labels from the tablist
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist.querySelectorAll('li[role="tab"]')).map(tab => {
    // Use the textContent directly, no hardcoding
    return tab.textContent.trim();
  });

  // Step 3: Get all tabpanels in correct order
  const panels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: ensure tabLabels.length === panels.length

  // Step 4: Build header row and tab label row
  const headerRow = ['Tabs (tabs13)'];
  const tabLabelRow = tabLabels;

  // Step 5: Build tab content row
  const tabContentRow = panels.map(panel => {
    // Find the main content inside each panel
    // Sometimes it's wrapped in a single article, sometimes it's a fragment
    let content;
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // Collect all children except script/style, and filter blank text nodes
      const nodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === 3) return node.textContent.trim().length > 0;
        if (node.nodeType === 1 && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE')) return false;
        return true;
      });
      // If just one, return the element, else return the array
      if (nodes.length === 1) {
        content = nodes[0];
      } else {
        content = nodes;
      }
    }
    return content;
  });

  // Step 6: Compose the cells as per example: 3 rows (header, tab labels, tab content)
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow
  ];

  // Step 7: Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Step 8: Replace the tabs block element with the new block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
