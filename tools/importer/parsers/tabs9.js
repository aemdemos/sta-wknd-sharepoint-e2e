/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (div with class 'cmp-tabs')
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (in the tablist)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // The tabs mapping is preserved by index
  // Construct the table rows: first is the header, rest are [label, content]
  const cells = [];
  // Header row – must match the block name per instructions
  cells.push(['Tabs (tabs9)']);

  // For each tab, push a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelElem = tabLabels[i];
    const label = labelElem ? labelElem.textContent.trim() : '';
    // Defensive: panels might be less than tabs if some are missing
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Use all direct children of the tabpanel as content
      // If there is just one main wrapper, use it directly
      let contentNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      if (contentNodes.length === 1) {
        content = contentNodes[0];
      } else if (contentNodes.length > 1) {
        // Place all nodes in an array, referencing existing nodes (not cloning)
        content = contentNodes;
      } else {
        content = '';
      }
    }
    cells.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs element with the table
  tabs.replaceWith(table);
}
