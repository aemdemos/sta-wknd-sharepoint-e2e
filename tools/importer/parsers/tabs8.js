/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root: it's the div with class 'cmp-tabs' (may not be a direct child)
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist (ol > li)
  const tablist = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabOrder = [];
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach(li => {
      tabOrder.push({
        label: li.textContent.trim(),
        id: li.getAttribute('id'),
        controls: li.getAttribute('aria-controls'),
      });
    });
  }

  // Map of tabpanel id -> panel element
  const tabPanels = {};
  cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]').forEach(panel => {
    tabPanels[panel.id] = panel;
  });

  // The header row should have two columns: ['Tabs (tabs8)', '']
  const rows = [ ['Tabs (tabs8)', ''] ];

  // Each row for the tabs: label, content
  tabOrder.forEach(tab => {
    let contentCell = null;
    const panel = tabPanels[tab.controls];
    if (panel) {
      const contentNodes = Array.from(panel.childNodes).filter(node => {
        // Only include elements and meaningful text nodes (not empty whitespace)
        return (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()));
      });
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        contentCell = '';
      }
    } else {
      contentCell = '';
    }
    rows.push([tab.label, contentCell]);
  });

  // Use createTable, then apply colspan to the header cell if possible
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Attempt to set colspan on the first header cell if there is a header row and two columns
  const firstRow = block.querySelector('tr');
  if (firstRow && firstRow.children.length === 2) {
    firstRow.children[0].setAttribute('colspan', '2');
    firstRow.children[1].remove();
  }

  element.replaceWith(block);
}
