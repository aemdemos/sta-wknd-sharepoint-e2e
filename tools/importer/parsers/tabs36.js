/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist (they are <li> inside <ol>)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels (contents). These are divs with role="tabpanel"
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Build the header row: block name only (per spec)
  const headerRow = ['Tabs (tabs36)'];

  // For each tab: [label, content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent = '';
    if (panel) {
      // Compose the contents of the tab: reference all direct children in the tabpanel
      // (This is robust to content structure variations.)
      const nodes = Array.from(panel.childNodes).filter(n => (
        n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      ));
      if (nodes.length === 1) {
        tabContent = nodes[0];
      } else if (nodes.length > 1) {
        tabContent = nodes;
      } else {
        tabContent = '';
      }
    }
    rows.push([label, tabContent]);
  }

  // Compose the table: header row, then one row per tab (label, content)
  const cells = [headerRow, ...rows];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
