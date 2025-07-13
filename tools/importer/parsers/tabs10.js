/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels, in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('[role="tab"]'));
  // Defensive: skip empty tab list
  if (tabItems.length === 0) return;
  const tabLabels = tabItems.map(tab => tab.textContent.trim());

  // Find tab panels in order as in source HTML
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  // Defensive: if no tab panels, return
  if (tabPanels.length === 0) return;

  // Compose header row: must match example exactly
  const headerRow = ['Tabs (tabs10)'];

  // Compose the tab labels row: one cell per tab
  const labelsRow = tabLabels;

  // Compose the tab content row: one cell per tab
  const contentRow = tabPanels.map(panel => {
    // Some panels wrap with .contentfragment, use it if present, else use panel
    const cf = panel.querySelector('.contentfragment');
    // Defensive: if missing, fallback to all children or empty div
    if (cf) {
      return cf;
    }
    // If no .contentfragment, try to collect all direct children
    if (panel.children.length > 0) {
      return Array.from(panel.children);
    }
    // If panel has text only
    if (panel.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = panel.textContent.trim();
      return p;
    }
    // Otherwise, empty
    return document.createElement('div');
  });

  // Cells: first row is header, second the tab labels, third the content row
  const cells = [
    headerRow,
    labelsRow,
    contentRow
  ];

  // Build table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
