/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabLis.map(li => li.textContent.trim());

  // Extract tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the cells array for the table:
  // 1. Header row: single cell
  // 2. Tab labels as column headers
  // 3. For each tab, a row with only that tab's content in the corresponding cell
  const cells = [];
  // First row: block name only
  cells.push(['Tabs (tabs23)']);
  // Second row: tab labels
  cells.push(tabLabels);
  // Content rows:
  for (let i = 0; i < tabLabels.length; i++) {
    const row = tabLabels.map((_, j) => {
      if (i === j) {
        const panel = tabPanels[i];
        if (panel) {
          // Reference all significant children of the panel
          const contentNodes = Array.from(panel.childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim());
          if (contentNodes.length === 0) return '';
          return contentNodes.length === 1 ? contentNodes[0] : contentNodes;
        }
      }
      return '';
    });
    cells.push(row);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
