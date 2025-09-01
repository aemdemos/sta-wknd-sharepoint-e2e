/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container by class
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tab list
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelsEls = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  const tabLabels = tabLabelsEls.map(tab => tab.textContent.trim());

  // Get tab panel elements
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: skip if number of tabs and panels mismatch
  if (tabLabels.length !== tabPanels.length) {
    // Try to only process matching pairs
    const n = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = n;
    tabPanels.length = n;
  }

  // Build cells array
  const cells = [];

  // Header row: block name
  cells.push(['Tabs (tabs26)']);

  // For each tab label/panel, find label and tab content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // The content for the tab is all the children of the tabpanel
    // We'll ignore empty text nodes, but keep all elements and non-empty texts
    const contentNodes = Array.from(panel.childNodes)
      .filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });

    // If only one node, use that, otherwise use array of nodes
    let tabContent;
    if (contentNodes.length === 1) {
      tabContent = contentNodes[0];
    } else {
      tabContent = contentNodes;
    }

    cells.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs container with the table
  tabsContainer.replaceWith(table);
}
