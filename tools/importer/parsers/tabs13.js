/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get the tablist and extract tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = tabList.querySelectorAll('[role="tab"]');
  const tabLabels = Array.from(tabLabelEls).map(tabEl => tabEl.textContent.trim());

  // Now, get the corresponding tab panel content for each tab (in order)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));
  // For each tab, find its content based on order
  const tabContents = tabPanels.map(panel => {
    // Typically the main content is a .contentfragment > article
    const article = panel.querySelector('article');
    if (article) {
      return article;
    }
    // fallback: just the whole panel
    return panel;
  });

  // Compose the cells array
  // First row: block name (single cell row)
  const headerRow = ['Tabs (tabs13)'];
  const cells = [headerRow];
  // Each subsequent row: [Tab Label, Tab Content] -- must be a two-column row
  for (let i = 0; i < tabLabels.length; i += 1) {
    cells.push([
      tabLabels[i],
      tabContents[i],
    ]);
  }

  // Build table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
