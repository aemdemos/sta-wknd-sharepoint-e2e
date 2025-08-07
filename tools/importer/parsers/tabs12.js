/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main Tabs block: look for .cmp-tabs inside the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find the tab labels (li elements in the tablist)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLis = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // Find all tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row matches example
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // Defensive: number of tabs is min(tabLis.length, tabPanels.length)
  const numTabs = Math.min(tabLis.length, tabPanels.length);
  for (let i = 0; i < numTabs; i++) {
    // First column: label (from tab <li>)
    const label = tabLis[i].textContent.trim();
    // Second column: content (everything inside the corresponding tabpanel)
    const panel = tabPanels[i];
    // Extract all child nodes that are not empty text
    const panelContent = Array.from(panel.childNodes).filter(node => {
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '';
    });
    // Use array if multiple, or single node, or '' (to handle empty case)
    let tabContent;
    if (panelContent.length === 0) {
      tabContent = '';
    } else if (panelContent.length === 1) {
      tabContent = panelContent[0];
    } else {
      tabContent = panelContent;
    }
    rows.push([label, tabContent]);
  }

  // If there are more tabs than panels (should not happen, but handle gracefully)
  if (tabLis.length > tabPanels.length) {
    for (let j = tabPanels.length; j < tabLis.length; j++) {
      rows.push([tabLis[j].textContent.trim(), '']);
    }
  }

  // Build the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
