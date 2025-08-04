/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element in the provided element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels from the tab list
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tabEl => {
      tabLabels.push(tabEl.textContent.trim());
    });
  }

  // Get all tabpanel elements (one per tab)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Prepare the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs37)']);

  // For each tab, add a row [Tab Label, Tab Content]
  for (let i = 0; i < tabPanels.length; i++) {
    const label = tabLabels[i] || '';
    const panel = tabPanels[i];

    // We'll use the .contentfragment article if present, else the direct .contentfragment, else the panel itself
    let contentElement = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment') || panel;

    // Remove the h3.cmp-contentfragment__title if present (since it duplicates tab label)
    if (contentElement.querySelector) {
      const h3 = contentElement.querySelector('.cmp-contentfragment__title');
      if (h3) h3.remove();
    }
    // Remove empty grid wrappers that carry no actual content
    if (contentElement.querySelectorAll) {
      contentElement.querySelectorAll('.aem-Grid').forEach(grid => {
        if (!grid.textContent.trim() && grid.children.length === 0) grid.remove();
      });
    }
    rows.push([label, contentElement]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
