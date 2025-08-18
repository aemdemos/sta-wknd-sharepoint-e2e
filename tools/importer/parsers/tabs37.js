/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (should match order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Create the table structure: Header row, then one row per tab (label, content)
  const cells = [['Tabs (tabs37)']];

  // Pair each tab label with its content in a [label, content] row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Get all direct children except empty text nodes
      const nodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      content = nodes.length === 1 ? nodes[0] : nodes;
    } else {
      content = '';
    }
    cells.push([label, content]);
  }

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new block table
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
