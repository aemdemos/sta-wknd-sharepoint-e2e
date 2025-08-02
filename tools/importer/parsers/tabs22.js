/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('.cmp-tabs__tab').forEach(tabEl => {
      tabLabels.push(tabEl.textContent.trim());
    });
  }

  // Get all tab panels (the content for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the header row as in the example
  const headerRow = ['Tabs (tabs22)'];
  const tableRows = [headerRow];

  // Now, each subsequent row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Collect all meaningful children of the panel
      let children = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
          return false;
        }
        // Exclude empty grid wrappers (just .aem-Grid or empty div)
        if (node.nodeType === Node.ELEMENT_NODE && node.matches('div') && node.classList.contains('aem-Grid')) {
          return false;
        }
        return true;
      });
      // If only one child, use it directly, otherwise array
      content = (children.length === 1) ? children[0] : children;
    }
    tableRows.push([label, content]);
  }

  // Create the table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
