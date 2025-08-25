/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the given element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels in order
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist.querySelectorAll('[role="tab"]'));

  // Get tab content panels, in the same order as labels
  const tabPanels = tabLabels.map(tab => {
    const controls = tab.getAttribute('aria-controls');
    return tabsBlock.querySelector(`#${controls}`);
  });

  // Build first row: block name (header)
  const headerRow = ['Tabs (tabs23)'];

  // Second row: tab labels as header
  const tabsHeaderRow = tabLabels.map(tab => tab.textContent.trim());

  // Third row: tab content
  const tabsContentRow = tabPanels.map(panel => {
    // Defensive: get the contentfragment/article inside the panel
    let contentNode;
    const cf = panel.querySelector('article');
    if (cf) {
      contentNode = cf;
    } else {
      // If not, use panel's childNodes, filter out empty text and grid divs
      const contentNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'DIV' && node.childNodes.length === 0) return false;
          return true;
        }
        return false;
      });
      if (contentNodes.length === 1) {
        contentNode = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentNode = contentNodes;
      } else {
        // Empty tab
        contentNode = document.createElement('div');
      }
    }
    return contentNode;
  });

  // Compose the table rows: header, labels, content
  const cells = [headerRow, tabsHeaderRow, tabsContentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(block);
}
