/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // The header row: ONLY the block name in a single column
  const headerRow = ['Tabs (tabs11)'];

  // Get tab labels and panels in correct order
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Utility: check if a node is a text node (without referencing Node global)
  function isTextNode(node) { return node && node.nodeType === 3; }

  // Each tab row must have two columns: tab label, tab content
  const tabRows = tabLabels.map((tab, idx) => {
    const label = tab.textContent.trim();
    let content = [];
    if (tabPanels[idx]) {
      // Use all children of the tabpanel, filtering out empty text nodes
      content = Array.from(tabPanels[idx].childNodes).filter(node => {
        return !(isTextNode(node) && node.textContent.trim().length === 0);
      });
      if (content.length === 0) content = [''];
    } else {
      content = [''];
    }
    return [label, content];
  });

  // Compose the table data: header row (1 column), then tab rows (2 columns each)
  const tableData = [headerRow, ...tabRows];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
