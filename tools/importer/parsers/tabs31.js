/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (support calling on the main container or directly on the tabs)
  let tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl && element.classList.contains('cmp-tabs')) {
    tabsEl = element;
  }
  if (!tabsEl) return;

  // Collect tab labels
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role=tab]')).map(tab => tab.textContent.trim());

  // Get all tab panels by querying all children that are .cmp-tabs__tabpanel
  const tabPanels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Check if we have at least 1 tab and 1 panel
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Build content row: each cell is the content of one tab, in order
  const tabContents = tabPanels.map(panel => {
    // Use the inner content of the tab panel as the content cell.
    const tabContentNodes = Array.from(panel.childNodes).filter(n => {
      return n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== '';
    });
    if (tabContentNodes.length === 1) {
      return tabContentNodes[0];
    } else {
      return tabContentNodes;
    }
  });

  // Build final rows
  // 1. Block header row (single column)
  // 2. Tab label row (one header cell for each tab)
  // 3. Tab content row (one content cell for each tab)
  const rows = [];
  rows.push(['Tabs (tabs31)']);
  rows.push(tabLabels);
  rows.push(tabContents);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
