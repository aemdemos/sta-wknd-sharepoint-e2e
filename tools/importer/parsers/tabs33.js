/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block which contains the tabbed content
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the <li> elements in the tablist (tab order)
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach((li) => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels in DOM order (should match tab order)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build header row
  const headerRow = ['Tabs (tabs33)'];
  // Row of tab labels (each column is a tab label)
  const tabLabelRow = tabLabels;
  // Row of tab contents (each column is content)
  const contentRow = tabPanels.map(tp => {
    // Reference the most useful content container inside the tab panel
    // Prefer the <article> if present (usually contains all tab content for that tab)
    const article = tp.querySelector('article');
    if (article) return article;
    // fallback: use the tab panel's content itself
    return tp;
  });

  // Edge case: If there are fewer tabPanels than tabLabels (shouldn't happen), fill with empty divs
  while (contentRow.length < tabLabels.length) {
    const emptyDiv = document.createElement('div');
    contentRow.push(emptyDiv);
  }

  // If there are more tabPanels than tabLabels, truncate extra panels
  if (contentRow.length > tabLabels.length) {
    contentRow.length = tabLabels.length;
  }

  // Structure: header, label row, content row (2 columns, n tabs)
  const cells = [headerRow, tabLabelRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire cmp-tabs block with the new table
  tabs.replaceWith(table);
}