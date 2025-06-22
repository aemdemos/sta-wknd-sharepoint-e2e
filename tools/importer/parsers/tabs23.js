/* global WebImporter */
export default function parse(element, { document }) {
  // Find the outermost .tabs container which wraps the .cmp-tabs
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const tabsContainer = tabsWrapper.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  const tabLabels = tabItems.map(tab => tab.textContent.trim());
  if (!tabLabels.length) return;

  // Get tab panels in order
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));
  const numTabs = tabLabels.length;

  // Build rows: header row and labels row
  const rows = [];
  rows.push(['Tabs (tabs23)']); // header row
  rows.push(tabLabels); // tab labels row

  // For each tab, create a row with content only in the matching column
  for (let i = 0; i < numTabs; i++) {
    const row = [];
    for (let j = 0; j < numTabs; j++) {
      if (i === j && tabPanels[i]) {
        // Reference (not clone) all relevant children from tabPanels[i]
        const nodes = Array.from(tabPanels[i].childNodes).filter(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && node.classList.contains('aem-Grid') && !node.textContent.trim()) return false;
            if (node.tagName === 'DIV' && !node.textContent.trim() && node.children.length === 0) return false;
            return true;
          }
          if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim() !== '';
          return false;
        });
        if (nodes.length === 1) {
          row.push(nodes[0]);
        } else if (nodes.length > 1) {
          row.push(nodes);
        } else {
          row.push('');
        }
      } else {
        row.push('');
      }
    }
    rows.push(row);
  }

  // Create the table and replace the ENTIRE tabs wrapper div
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsWrapper.replaceWith(block);
}
