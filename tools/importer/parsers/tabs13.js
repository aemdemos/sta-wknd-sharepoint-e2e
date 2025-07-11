/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsPanel = element.querySelector('.tabs .cmp-tabs');
  if (!tabsPanel) return;

  // Get tab labels
  const tablist = tabsPanel.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach((li) => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels (order matches tab labels)
  const panels = Array.from(tabsPanel.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows
  const rows = [];
  // Block header (single cell)
  rows.push(['Tabs (tabs13)']);
  // Tab labels row (multi-column)
  rows.push(tabLabels);
  // Each tab content as a single cell row (span all columns)
  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i];
    let content = '';
    // Use major article if present, else the panel
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      content = panel;
    }
    // Each row is a single cell with the content (spanning all columns)
    rows.push([content]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsPanel.replaceWith(table);
}
