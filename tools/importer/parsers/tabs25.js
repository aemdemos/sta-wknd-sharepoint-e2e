/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the <ol> with class cmp-tabs__tablist
  const tabList = tabs.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tabEl => {
      tabLabels.push(tabEl.textContent.trim());
    });
  }

  // Get all .cmp-tabs__tabpanel elements in the order they appear in the DOM
  // Each tabpanel contains the tab's content
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');
  const tabContents = [];
  tabPanels.forEach(panel => {
    // Prefer to reference the .cmp-contentfragment inside the panel if it exists
    let mainContent = panel.querySelector('.cmp-contentfragment, .contentfragment');
    if (!mainContent) {
      // fallback: use the panel's children
      // We'll gather all children nodes except empty text nodes
      const nodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          return true;
        }
        return false;
      });
      if (nodes.length === 1) {
        mainContent = nodes[0];
      } else {
        // If there are multiple nodes, wrap them in a div
        const div = document.createElement('div');
        nodes.forEach(n => div.appendChild(n));
        mainContent = div;
      }
    }
    tabContents.push(mainContent);
  });

  // Build the table rows: first row is header, following are [Tab Label, Tab Content]
  const rows = [];
  rows.push(['Tabs (tabs25)']);
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    const content = tabContents[i] || '';
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the .cmp-tabs element with the constructed table
  tabs.replaceWith(table);
}
