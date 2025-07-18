/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li[role=tab])
  const tablist = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabNodes = tablist ? Array.from(tablist.querySelectorAll('li[role="tab"]')) : [];

  // Get all tab panels, map id -> panel
  const tabpanelNodes = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));
  const tabPanelMap = {};
  tabpanelNodes.forEach(panel => { tabPanelMap[panel.id] = panel; });

  // Build table rows: first row is single cell header, following are [label, content]
  const rows = [["Tabs (tabs37)"]];
  tabNodes.forEach(tab => {
    const label = tab.textContent.trim();
    let content = null;
    const panelId = tab.getAttribute('aria-controls');
    const panel = tabPanelMap[panelId];
    if (panel) {
      // Use the first child if present, else the panel itself
      content = panel.children.length === 1 ? panel.children[0] : panel;
    } else {
      content = document.createTextNode('');
    }
    rows.push([label, content]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
