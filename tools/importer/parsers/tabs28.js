/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within this section
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabList = tabsBlock.querySelector('ol.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (one per tab, in order)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: skip if mismatched lengths
  if (tabLabels.length === 0 || tabPanels.length !== tabLabels.length) return;

  // Header row (block name exactly as requested)
  const headerRow = ['Tabs (tabs28)'];

  // Second row: tab label elements (as <strong> for each tab, per example screenshot)
  const labelRow = tabLabels.map(tab => {
    // Use a <strong> as tab label, referencing the li's text
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });

  // Third row: tab panel DOM nodes (reference tabPanels, not clones or innerHTML)
  const contentRow = tabPanels.map(panel => panel);

  // Build cells array with 3 rows: header, tab labels, tab contents
  const cells = [
    headerRow,
    labelRow,
    contentRow
  ];

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block in the DOM
  tabsBlock.replaceWith(table);
}
