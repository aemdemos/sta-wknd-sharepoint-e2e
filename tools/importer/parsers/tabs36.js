/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (order matters)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  );

  // Get all tab panels/content, in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build the block rows, starting with the header
  const cells = [ ['Tabs (tabs36)'] ];

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    const panel = tabPanels[i];
    let contentNodes = [];
    if (panel) {
      // Only meaningful nodes
      for (const node of panel.childNodes) {
        if (
          (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') ||
          (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        ) {
          contentNodes.push(node);
        }
      }
    }
    if (contentNodes.length === 0) contentNodes = [''];
    cells.push([label, contentNodes]);
  }

  // Generate the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
