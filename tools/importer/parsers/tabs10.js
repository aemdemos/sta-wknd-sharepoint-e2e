/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block; supports variable nesting
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tablist = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab contents from tabpanel nodes, referencing original elements
  const tabPanels = tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  const tabContents = [];
  tabPanels.forEach(panel => {
    // Prefer the direct contentfragment/article, else the panel itself
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      tabContents.push(article);
    } else {
      tabContents.push(panel);
    }
  });

  // Compose the table rows
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // For each tab: Tab Label | Tab Content
    rows.push([tabLabels[i], tabContents[i]]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(blockTable);
}
