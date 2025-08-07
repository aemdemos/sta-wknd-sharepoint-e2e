/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabsWrapper = element.querySelector('.cmp-tabs');
  if (!tabsWrapper) return;

  // Get all tab labels in correct order
  const tabList = tabsWrapper.querySelector('ol.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tabpanels - contents for each tab in the DOM order
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('[role="tabpanel"]'));
  
  // Compose the header row - exactly one cell
  const headerRow = ['Tabs (tabs23)'];

  // Each row after the header: [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel, idx) => {
    // Tab Content: Use article.cmp-contentfragment if present, else direct tabPanel
    let contentElement;
    if (tabPanels[idx]) {
      const cf = tabPanels[idx].querySelector('article.cmp-contentfragment');
      contentElement = cf ? cf : tabPanels[idx];
    } else {
      contentElement = document.createTextNode('');
    }
    return [tabLabel.textContent.trim(), contentElement];
  });

  // Build table: header row is single cell, tab rows are [label, content]
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
