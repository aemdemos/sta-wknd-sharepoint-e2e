/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (tab titles)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Find all tab panels (tab contents)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose the table: first row is header with proper block name and variant
  const cells = [];
  const headerRow = ['Tabs (tabs13)'];
  cells.push(headerRow);

  // Each tab gets a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Find the corresponding tabpanel. Rely on order.
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // For resilience, reference the direct children of the tabpanel
      let children = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      // If only one child, reference it directly, else pass the array
      if (children.length === 1) {
        content = children[0];
      } else if (children.length > 1) {
        content = children;
      } else {
        content = '';
      }
    } else {
      content = '';
    }
    cells.push([label, content]);
  }

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
