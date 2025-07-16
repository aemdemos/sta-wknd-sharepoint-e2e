/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (order matters)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim()) : [];

  // Get all tab panels (should match order of labels)
  const panels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build header row per requirements
  const headerRow = ['Tabs (tabs31)'];
  // Each row: [Tab Label, Tab Content]
  const tabRows = [];
  for(let i=0; i<tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = panels[i];
    let tabContent;
    if (panel) {
      // Prefer <article> inside panel, but if not found, use all children
      const article = panel.querySelector('article');
      if (article) {
        tabContent = article;
      } else if (panel.children.length > 0) {
        tabContent = Array.from(panel.children);
      } else {
        // fallback to text, very unlikely in this structure
        tabContent = panel.textContent.trim();
      }
    } else {
      tabContent = '';
    }
    tabRows.push([label, tabContent]);
  }

  // Compose table
  const cells = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
