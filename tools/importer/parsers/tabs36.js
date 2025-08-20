/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container inside the provided element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from tablist (each tab is a li)
  const tablist = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabEls = tablist ? Array.from(tablist.querySelectorAll('li')) : [];
  const tabLabels = tabEls.map(tabEl => tabEl.textContent.trim());

  // Get tab panels, which contain the content for each tab
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Each tab panel should map to a tab label by order
  // We'll preserve the semantic meaning by referencing the whole contentfragment/article inside each panel
  // If contentfragment is missing, use the panel div itself
  const contentNodes = tabPanels.map(panel => {
    const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    return cf || panel;
  });

  // Header row: block name exactly as specified
  const headerRow = ['Tabs (tabs36)'];
  // Second row: tab labels (as plain text, not wrapped in spans)
  const labelsRow = tabLabels;
  // Third row: tab contents (each referenced element)
  const contentsRow = contentNodes;

  // Compose table cells array: 3 rows, each with N columns, where N is the number of tabs
  const cells = [headerRow, labelsRow, contentsRow];

  // Create the block table using the helper
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabsContainer with the new block table
  tabsContainer.replaceWith(table);
}
