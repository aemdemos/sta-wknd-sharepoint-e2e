/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Get tab labels (as text)
  const tabLabelEls = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tablist > li'));
  if (tabLabelEls.length === 0) return;
  const labelsRow = tabLabelEls.map(li => li.textContent.trim());

  // Get all tab panels (order must match tab labels)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row: block name, one column only
  const headerRow = ['Tabs (tabs36)'];

  // For each tab, create a row with content only in its column; others empty
  const tabContentRows = tabPanels.map((panel, idx) => {
    const numCols = labelsRow.length;
    const cf = panel.querySelector('.contentfragment') || panel;
    // Create an array of empty strings with only the idx-th column containing cf
    return Array.from({length: numCols}, (_, i) => i === idx ? cf : '');
  });

  // Compose final table
  const cells = [
    headerRow,
    labelsRow,
    ...tabContentRows
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
