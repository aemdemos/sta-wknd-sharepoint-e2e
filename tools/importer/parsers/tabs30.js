/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get all tab labels
  const tabListItems = tabsEl.querySelectorAll('.cmp-tabs__tablist > li');
  // Get all tab panels (contents)
  const tabPanels = tabsEl.querySelectorAll('.cmp-tabs__tabpanel');

  // Defensive: Only process if counts match
  if (tabListItems.length !== tabPanels.length || tabListItems.length === 0) return;

  // Header row: must be a single cell with the block name
  const headerRow = ['Tabs (tabs30)'];
  const tableRows = [headerRow];

  // Each subsequent row: [Tab Label, Tab Content]
  for (let i = 0; i < tabListItems.length; i++) {
    // First cell: The tab label
    const tabLabel = tabListItems[i].textContent.trim();
    // Second cell: The content, as a reference to existing children of the tabpanel
    const panel = tabPanels[i];
    // Try to find a main content element
    let tabContentRoot = panel.querySelector('article') || panel;
    // Get all children, but skip the h3.cmp-contentfragment__title if present at the top
    const allChildren = Array.from(tabContentRoot.children);
    let contentNodes = [];
    let startIdx = 0;
    if (allChildren[0] && allChildren[0].classList && allChildren[0].classList.contains('cmp-contentfragment__title')) {
      startIdx = 1;
    }
    for (let j = startIdx; j < allChildren.length; j++) {
      contentNodes.push(allChildren[j]);
    }
    // If nothing was added, fallback to all nodes (could be just text)
    if (contentNodes.length === 0) {
      contentNodes = Array.from(tabContentRoot.childNodes).filter(n => {
        // Remove whitespace-only text nodes
        return !(n.nodeType === 3 && !n.textContent.trim());
      });
    }
    // If only one node, use that node, otherwise use array
    const contentCell = (contentNodes.length === 1) ? contentNodes[0] : contentNodes;
    tableRows.push([tabLabel, contentCell]);
  }

  // Create the table and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
