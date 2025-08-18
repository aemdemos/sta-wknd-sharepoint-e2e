/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element, which is the source for the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Gather tab labels from the tablist
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Gather tabpanel elements (tab contents)
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Compose the table rows
  const cells = [];
  // Header row (1 column)
  cells.push(['Tabs (tabs20)']);
  // Tab labels row (each label in its own column)
  cells.push(tabLabels);
  // For each tab, create a row with 2 columns: [tab label, tab content]
  for (let i = 0; i < numTabs; i++) {
    // Get all non-empty child nodes for this tab panel
    let panelContent;
    if (tabPanels[i]) {
      const nodes = Array.from(tabPanels[i].childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) return true;
        return false;
      });
      panelContent = nodes.length === 1 ? nodes[0] : nodes;
    } else {
      panelContent = '';
    }
    cells.push([tabLabels[i], panelContent]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
