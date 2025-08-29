/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the block
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabLabelEls = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabLabelsRow = tabLabelEls.map(tabEl => tabEl.textContent.trim());

  // Get all tab contents in order (one cell per tab in a single row)
  const tabPanelEls = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  const tabContentRow = tabPanelEls.map(tabPanel => {
    // Use the .contentfragment if it exists for resilience
    const fragment = tabPanel.querySelector('.contentfragment');
    return fragment || tabPanel;
  });

  // Compose final table: header row (1 cell), tab label row (N cells), tab content row (N cells)
  const cells = [
    ['Tabs (tabs7)'],
    tabLabelsRow,
    tabContentRow
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  cmpTabs.replaceWith(table);
}
