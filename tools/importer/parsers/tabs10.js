/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the supplied element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (they are .cmp-tabs__tab inside .cmp-tabs__tablist)
  const tablist = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabItems = Array.from(tablist.querySelectorAll('[role="tab"]'));
  if (tabItems.length === 0) return;

  // For each tab, get label and corresponding tab panel content
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];

  tabItems.forEach((tab) => {
    const label = tab.textContent.trim();
    const tabPanelId = tab.getAttribute('aria-controls');
    // Defensive: skip if missing panel id or label
    if (!tabPanelId || !label) return;
    const panel = tabsRoot.querySelector(`#${tabPanelId}`);
    if (!panel) return;
    // Tab content: we want the visible content, which is the children of the tabpanel
    // Sometimes a single wrapper, sometimes multiple blocks
    // We'll gather all ELEMENT_NODE children and include in the cell
    const tabContentNodes = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) return true;
      return false;
    });
    // If only one node, use that node directly; else, use an array
    let contentCell;
    if (tabContentNodes.length === 1) {
      contentCell = tabContentNodes[0];
    } else {
      // Use array to preserve order and structure
      contentCell = tabContentNodes;
    }
    rows.push([label, contentCell]);
  });

  // Create the block table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsRoot.replaceWith(table);
}
