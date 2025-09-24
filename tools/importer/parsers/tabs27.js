/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs inside the tabs container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li.cmp-tabs__tab'));
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanelEls = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only keep as many panels as labels
  const numTabs = Math.min(tabLabels.length, tabPanelEls.length);

  // Build table rows
  const headerRow = ['Tabs (tabs27)'];
  const rows = [headerRow];

  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanelEls[i];
    // Defensive: grab all children of the tabpanel
    const tabContentNodes = Array.from(panel.childNodes).filter(n => {
      // Exclude empty text nodes
      return n.nodeType !== Node.TEXT_NODE || n.textContent.trim().length > 0;
    });
    // If only one node, just use it, else use array
    const tabContent = tabContentNodes.length === 1 ? tabContentNodes[0] : tabContentNodes;
    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsContainer with the table
  tabsContainer.replaceWith(table);
}
