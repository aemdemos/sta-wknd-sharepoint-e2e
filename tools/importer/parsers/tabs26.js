/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root: .tabs > .cmp-tabs
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Find the tab labels (li elements)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li.cmp-tabs__tab'));
  if (!tabLabels.length) return;

  // Find the tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // It is possible some are hidden (aria-hidden="true"); but we want all, and order matches tab labels

  // Defensive: ensure counts match
  if (tabLabels.length !== tabPanels.length) {
    // If counts do not match, fallback to the minimum
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Compose the table:
  // First row: block name (per requirements)
  const headerRow = ['Tabs (tabs26)'];

  // Second row: tab names
  const labelRow = tabLabels.map(label => label.textContent.trim());

  // Third row: tab content elements (reference main content per tab)
  const contentRow = tabPanels.map(panel => {
    // Try to find the primary content inside panel (usually article, sometimes the first child)
    // Prefer the <article> if present
    const art = panel.querySelector('article');
    if (art) return art;
    // Or, if not, the first element child in the panel
    const firstElement = Array.from(panel.children).find(child => child.nodeType === 1);
    if (firstElement) return firstElement;
    // Fallback: the panel itself
    return panel;
  });

  // Compose the cells in the expected order
  const cells = [
    headerRow,
    labelRow,
    contentRow
  ];

  // Create table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs container with the table
  tabsContainer.replaceWith(table);
}
