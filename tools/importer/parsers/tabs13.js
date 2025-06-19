/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll(':scope > li')) : [];

  // Find the tab panels (divs with .cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll(':scope > .cmp-tabs__tabpanel'));

  // Structure per the markdown example
  // Header row: block name, single cell
  const headerRow = ['Tabs (tabs13)'];
  // Second row: tab labels, one per column, use the <li> elements directly
  const labelsRow = tabLabelEls.map(tab => tab);
  // Third row: tab contents, one per column, use the corresponding tab panel DOM nodes
  const contentRow = tabPanels.map(panel => {
    // Use the entire content of the tab panel as a single cell
    // Remove empty text nodes
    const nodes = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
      return true;
    });
    if (nodes.length === 1) {
      return nodes[0];
    } else if (nodes.length > 1) {
      // Wrap in a div if multiple nodes
      const wrapper = document.createElement('div');
      nodes.forEach(node => wrapper.appendChild(node));
      return wrapper;
    } else {
      return '';
    }
  });

  // Compose table: header, labels, content
  const cells = [
    headerRow,
    labelsRow,
    contentRow
  ];

  // Create the table and replace the original tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
