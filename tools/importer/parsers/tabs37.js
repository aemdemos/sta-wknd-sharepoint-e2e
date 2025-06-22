/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tab block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab list (labels)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get the tab panels (content), in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Build the cells for the block table
  // Header row: always as per specification
  const headerRow = ['Tabs (tabs37)'];
  const cells = [headerRow];

  // Each row: [label, content]
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // For content, reference the entire panel content, not just text
    // Prefer to reference the main contentfragment/article if present
    let content = null;
    const cf = panel.querySelector('.cmp-contentfragment, article');
    if (cf) {
      content = cf;
    } else {
      // Otherwise, collect all child nodes
      const nodes = Array.from(panel.childNodes).filter(n => {
        // Ignore whitespace
        if (n.nodeType === Node.TEXT_NODE) {
          return n.textContent.trim().length > 0;
        }
        return true;
      });
      content = nodes.length === 1 ? nodes[0] : nodes;
    }
    cells.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the element with the new table
  element.replaceWith(table);
}
