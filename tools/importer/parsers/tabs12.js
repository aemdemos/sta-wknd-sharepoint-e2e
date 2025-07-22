/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the list of tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get the tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // For correct structure, header row should be a single cell
  // but our table body is two columns, so the header cell needs to span two columns
  // WebImporter.DOMUtils.createTable will automatically set colspan if needed
  const headerRow = ['Tabs (tabs12)']; // single cell
  const rows = [headerRow];

  // For each tab, add a row [label, content] (two columns)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let panelContent = '';
    if (panel) {
      // Use all children of the tabpanel as content (preserves structure)
      const children = Array.from(panel.children);
      if (children.length === 1) {
        panelContent = children[0];
      } else if (children.length > 1) {
        panelContent = children;
      } else {
        // If only text
        panelContent = panel.textContent.trim();
      }
    }
    rows.push([label, panelContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
