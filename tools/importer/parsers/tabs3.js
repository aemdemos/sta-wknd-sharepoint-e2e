/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract all the tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  if (!tabLabels.length) return;

  // Extract all tab panels (tab content)
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  if (tabPanels.length !== tabLabels.length) return;

  // Block header row
  const headerRow = ['Tabs (tabs3)'];
  // Tab label row (one cell per tab label)
  const tabLabelRow = tabLabels.map(li => {
    const strong = document.createElement('strong');
    strong.textContent = li.textContent.trim();
    return strong;
  });

  // For each tab, create a row with a single cell (array) containing all its content
  const tabContentRows = tabPanels.map(tabpanel => {
    let mainContent = tabpanel.querySelector('.cmp-contentfragment__elements') || tabpanel.querySelector('.contentfragment');
    if (!mainContent) mainContent = tabpanel;
    const nodes = Array.from(mainContent.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if ((node.classList.contains('aem-Grid') || node.classList.contains('aem-GridColumn')) && node.textContent.trim() === '') {
          return false;
        }
        if (
          node.tagName === 'DIV' && node.children.length === 1 &&
          (node.firstElementChild.classList.contains('aem-Grid') || node.firstElementChild.classList.contains('aem-GridColumn')) &&
          node.firstElementChild.textContent.trim() === ''
        ) {
          return false;
        }
      }
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') {
        return false;
      }
      return true;
    });
    // If only one, reference it, otherwise array of nodes
    let content;
    if (nodes.length === 1) {
      content = nodes[0];
    } else if (nodes.length > 1) {
      content = nodes;
    } else {
      content = document.createTextNode('');
    }
    // Each tab's content goes in its own row as a single-cell array
    return [content];
  });

  // Compose table rows: header, tab label row, then one row per tab (all single cell)
  const cells = [
    headerRow,
    tabLabelRow,
    ...tabContentRows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(table);
}
