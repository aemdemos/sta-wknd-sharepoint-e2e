/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root element.
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach((tab) => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels in the order they appear
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel[data-cmp-hook-tabs="tabpanel"]')
  );

  // Table header must match example: 'Tabs (tabs31)'
  const cells = [['Tabs (tabs31)']];

  // For each tab, add a row [label, content]
  tabPanels.forEach((tabpanel, idx) => {
    // Tab label from tabLabels or fallback
    const tabLabel = tabLabels[idx] || `Tab ${idx + 1}`;
    // Tab content: reference the visible content
    // Prefer .contentfragment, otherwise all children of tabpanel
    let contentfragment = tabpanel.querySelector('.contentfragment');
    let contentBlock;
    if (contentfragment) {
      // reference all children (not TEXT_NODE-only whitespace)
      const nodes = Array.from(contentfragment.childNodes).filter(
        node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
      );
      // If only one node, use it directly, else array
      contentBlock = nodes.length === 1 ? nodes[0] : nodes;
    } else {
      const nodes = Array.from(tabpanel.childNodes).filter(
        node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
      );
      contentBlock = nodes.length === 1 ? nodes[0] : nodes;
    }
    cells.push([tabLabel, contentBlock]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  cmpTabs.replaceWith(table);
}
