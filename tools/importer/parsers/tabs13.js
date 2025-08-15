/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from tablist
  const tablist = tabsRoot.querySelector('[role="tablist"]');
  const tabLabels = Array.from(tablist.querySelectorAll('[role="tab"]')).map(label => label.textContent.trim());

  // Get all tabpanel elements in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Each subsequent row: [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // For each panel, try to locate the content fragment for richer content
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // If there is a cmp-contentfragment/article, use it; else use panel's children
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // Use all children of panel (excluding empty grids)
        const parts = Array.from(panel.children).filter(
          el => !(el.classList && el.classList.contains('aem-Grid'))
        );
        if (parts.length === 1) {
          content = parts[0];
        } else if (parts.length > 1) {
          content = parts;
        } else {
          content = panel;
        }
      }
    }
    rows.push([label, content]);
  }

  // Table structure: header row, then each tab row
  const tableData = [['Tabs (tabs13)'], ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original tabs block with the new block table
  tabsRoot.replaceWith(table);
}
