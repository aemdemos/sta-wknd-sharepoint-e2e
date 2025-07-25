/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided HTML
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract all tab labels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);
  // Extract all tab panels (in order)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If no tabs, don't continue
  if (!tabLabels.length || !tabPanels.length) return;

  // Header row: must match exactly one column, as in the example
  const headerRow = ['Tabs (tabs28)'];

  // Now, for each tab, construct a row: [label, content]
  const rows = tabLabels.map((label, i) => {
    // Tab label as string (trimmed)
    const tabLabel = label.textContent.trim();
    // Tab content
    const panel = tabPanels[i];
    // Prefer rich content (contentfragment article) if present; else, use panel itself
    let tabContent;
    const article = panel ? panel.querySelector('article.cmp-contentfragment') : null;
    if (article) {
      tabContent = article;
    } else if (panel) {
      tabContent = panel;
    } else {
      tabContent = '';
    }
    return [tabLabel, tabContent];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
