/* global WebImporter */
export default function parse(element, { document }) {
  // Locate tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = tabList.querySelectorAll('[role="tab"]');
  const tabLabels = Array.from(tabLabelElements).map(tab => tab.textContent.trim());
  if (!tabLabels.length) return;

  // Extract panels in order
  const panelElements = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');
  if (!panelElements.length) return;

  // Build cells array
  const cells = [];
  // First row: single cell with block name
  cells.push(['Tabs (tabs16)']);
  // Second row: tab labels as individual header cells
  cells.push(tabLabels);
  // For each tab, new row, only one cell filled per row, others empty
  for (let i = 0; i < tabLabels.length; i++) {
    const row = new Array(tabLabels.length).fill('');
    const panel = panelElements[i];
    // Reference the panel's content, which may include a contentfragment etc
    // We'll include all children (may be just one child)
    let content;
    if (panel.children.length === 1) {
      content = panel.children[0];
    } else if (panel.children.length > 1) {
      content = Array.from(panel.children);
    } else {
      content = panel;
    }
    row[i] = content;
    cells.push(row);
  }

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
