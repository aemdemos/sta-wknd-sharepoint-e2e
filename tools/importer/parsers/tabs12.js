/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')).map(li => li.textContent.trim()) : [];

  // Get tab panels (tab content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    // fallback: try to match by order
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Header row
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // Each tab: [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;
    // Tab label cell
    const labelCell = label;

    // Tab content cell: gather all visible content nodes
    let contentCell;
    // If panel has only one element and it's a contentfragment, use its children
    const cf = panel.querySelector(':scope > .contentfragment, :scope > article.cmp-contentfragment');
    if (cf) {
      // Use all children nodes of the contentfragment
      const nodes = Array.from(cf.childNodes).filter(n => {
        if (n.nodeType === 3) return n.textContent.trim().length > 0;
        if (n.nodeType === 1) return n.textContent.trim().length > 0;
        return false;
      });
      contentCell = nodes.length === 1 ? nodes[0] : nodes;
    } else {
      // Use all children nodes of the panel
      const nodes = Array.from(panel.childNodes).filter(n => {
        if (n.nodeType === 3) return n.textContent.trim().length > 0;
        if (n.nodeType === 1) return n.textContent.trim().length > 0;
        return false;
      });
      contentCell = nodes.length === 1 ? nodes[0] : nodes;
    }
    rows.push([labelCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block
  tabsContainer.replaceWith(block);
}
