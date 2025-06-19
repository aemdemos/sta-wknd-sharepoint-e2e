/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (scope to element)
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels from the tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim()) : [];

  // Get the tabpanels (in order)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows. First row is always the block header
  const rows = [
    ['Tabs (tabs23)']
  ];

  // Create one row per tab: [Tab Label, Tab Content]
  const rowCount = Math.min(tabLabels.length, tabPanels.length);
  for (let i = 0; i < rowCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Prefer the contentfragment if present, otherwise all content of the panel
      const article = panel.querySelector('article.cmp-contentfragment');
      if (article) {
        contentCell = article;
      } else {
        // Use all non-empty content nodes from the panel
        const nodes = Array.from(panel.childNodes).filter(n => !(n.nodeType === 3 && !n.textContent.trim()));
        if (nodes.length === 1) {
          contentCell = nodes[0];
        } else if (nodes.length > 1) {
          contentCell = nodes;
        } else {
          contentCell = '';
        }
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the table in the correct format
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(table);
}
