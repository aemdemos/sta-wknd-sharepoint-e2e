/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the current element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist (in order)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels in the order they appear
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build the table: first row = block name, then each tab as a row [label, content]
  const cells = [];
  cells.push(['Tabs (tabs28)']); // Header row: single column

  // For each tab, push a row: [Label, Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Extract all non-empty child nodes
    const nodes = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    let content;
    if (nodes.length === 1) {
      content = nodes[0];
    } else if (nodes.length > 1) {
      content = nodes;
    } else {
      content = '';
    }
    cells.push([label, content]);
  }

  // Create the table and replace the tabs block in the DOM
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
