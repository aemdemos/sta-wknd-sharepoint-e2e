/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 1. Get the tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelItems = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  if (!tabLabelItems.length) return;

  // 2. Find the tab panels in the same order as the labels
  // Panels are direct children with cmp-tabs__tabpanel
  const allPanels = Array.from(tabs.querySelectorAll(':scope > .cmp-tabs__tabpanel'));

  // Defensive: if not found, look for all tabpanels in tab order
  if (!allPanels.length) return;

  // 3. Build the table rows
  // Header row: block name (from instructions)
  const headerRow = ['Tabs (tabs25)'];

  // Tab label row (all labels, one per tab) -- match the screenshot: each label is a cell
  const tabLabelRow = tabLabelItems.map(tab => {
    // If the tab is active, make it bold (strong), else plain text
    const labelText = tab.textContent.trim();
    if (tab.classList.contains('cmp-tabs__tab--active')) {
      const strong = document.createElement('strong');
      strong.textContent = labelText;
      return strong;
    }
    return labelText;
  });

  // Tab content row: each cell is the whole tabpanel content
  // Reference the main content for each tab
  const tabContentRow = allPanels.map(panel => {
    // Prefer to return the main contentfragment/article inside panel, else panel itself
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) return article;
    // Fallback: find first div.contentfragment
    const cf = panel.querySelector('div.contentfragment');
    if (cf) return cf;
    // Fallback: use panel itself
    return panel;
  });

  // Compose the table data
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow
  ];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
