/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Extract tab panels
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Get column count for padding
  const colCount = tabLabels.length;

  // First row: header, block name in first cell, then pad with empty string
  const headerRow = [ 'Tabs (tabs37)' ];
  while (headerRow.length < colCount) headerRow.push('');

  // Second row: tab labels as <strong>, in each respective column
  const labelsRow = tabLabels.map(label => {
    const strong = document.createElement('strong');
    strong.textContent = label;
    return strong;
  });

  // Third row: tab content, each in its column
  const contentsRow = tabPanels.map(panel => {
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) return cf;
    // fallback to all element and significant text content if no article found
    const contents = Array.from(panel.childNodes).filter(
      n => (n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim()))
    );
    if (contents.length === 1) return contents[0];
    if (contents.length > 1) return contents;
    return '';
  });

  const rows = [headerRow, labelsRow, contentsRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
