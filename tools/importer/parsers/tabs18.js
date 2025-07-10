/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const tabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all tab panels (in the order as in the DOM)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the table rows
  const tableRows = [];
  // Header row: block name (exactly as in the spec)
  tableRows.push(['Tabs (tabs18)']);

  // Each subsequent row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let contentCell = '';
    if (tabPanels[i]) {
      // Find main content fragment or fallback to panel
      const contentFragment = tabPanels[i].querySelector('.contentfragment');
      // If contentFragment exists, use it; else, use panel itself
      contentCell = contentFragment || tabPanels[i];
    }
    tableRows.push([label, contentCell]);
  }

  // Create block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  tabsWrapper.replaceWith(table);
}
