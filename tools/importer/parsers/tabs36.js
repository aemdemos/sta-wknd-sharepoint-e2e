/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels: li.cmp-tabs__tab inside ol.cmp-tabs__tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.children) : [];

  // Get the tab panels: div[role=tabpanel][data-cmp-hook-tabs="tabpanel"]
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Compose the header row for the block table
  const headerRow = ['Tabs (tabs36)'];

  // For each tab, create a row: [tab label, tab content]
  const tabRows = tabLabelEls.map((tabLabelEl, idx) => {
    // Reference the label element (keep original, for semantic accuracy)
    const label = tabLabelEl;
    // Reference the matching contentfragment (or fallback to panel itself)
    let content = tabPanels[idx]?.querySelector('.contentfragment') || tabPanels[idx];
    return [label, content];
  });

  // Compose the final cells array: header row + one row per tab, each with two columns
  const cells = [headerRow, ...tabRows];

  // Create the table and replace the tabs block in the DOM
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
