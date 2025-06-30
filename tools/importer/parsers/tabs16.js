/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs inside the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels from the tab list
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []).map(tab => tab.textContent.trim());

  // Extract tab panels in DOM order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // If no tabs or panels, abort
  if (!tabLabels.length || !tabPanels.length) return;

  // Header row: block name MUST be a single cell (not padded), to match the markdown example
  const headerRow = ['Tabs (tabs16)'];
  // Second row: tab labels as headers (one per column)
  const tabLabelRow = [...tabLabels];

  // Each subsequent row: only one cell is filled for each tab's content, the rest are empty
  // The row should have the same number of columns as tabLabels
  const contentRows = tabPanels.map((panel, idx) => {
    // Get the content area: prefer .contentfragment if present, else use the tabpanel itself
    let tabContentElem = panel.querySelector('.contentfragment') || panel.querySelector('article.cmp-contentfragment') || panel;
    // Build a row with N columns (one per label), only the cell at idx filled
    return tabLabels.map((lbl, cidx) => (cidx === idx ? tabContentElem : ''));
  });

  // Build the table as an array of rows
  const rows = [headerRow, tabLabelRow, ...contentRows];

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
