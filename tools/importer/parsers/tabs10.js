/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li inside the tabs list)
  const tabLabels = Array.from(tabsContainer.querySelectorAll('ol.cmp-tabs__tablist > li'));

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsContainer.querySelectorAll('div[role="tabpanel"]'));

  // Header row: single cell with block name
  const headerRow = ['Tabs (tabs10)'];

  // Tab labels: all labels in a single cell (as siblings)
  const labelCellElements = tabLabels.map(li => {
    const span = document.createElement('span');
    span.textContent = li.textContent.trim();
    return span;
  });
  // The labels row must be a single cell containing all spans (NOT one cell per label)
  const labelsRow = [labelCellElements];

  // Each tab content as a single cell row (array of one cell)
  const contentRows = tabPanels.map(panel => {
    const children = [];
    panel.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList && node.classList.contains('aem-Grid')) return;
        if (node.tagName === 'DIV' && node.innerHTML.trim() === '') return;
        children.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        children.push(span);
      }
    });
    let cellContent = children;
    if (children.length === 0) {
      const div = document.createElement('div');
      div.innerHTML = panel.innerHTML;
      cellContent = [div];
    }
    return [cellContent];
  });

  // Final table data: header, label row, and a row for each tab content
  const tableData = [headerRow, labelsRow, ...contentRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
