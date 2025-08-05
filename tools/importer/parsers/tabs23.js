/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels
  const tabList = tabsBlock.querySelector('ol.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Find tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process matching pairs
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build rows: 1st row is header, then one row per tab
  const rows = [];
  // Header row: Block name as in the requirement
  rows.push(['Tabs (tabs23)']);

  // Each tab row: [tab label text, tab content]
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i].textContent.trim();
    // Get tab content: find direct children (skip possible nested grid wrappers etc)
    const panel = tabPanels[i];

    // Try to extract the main content under .cmp-contentfragment__elements or just panel children
    let content = null;
    const fragmentElements = panel.querySelector('.cmp-contentfragment__elements');
    if (fragmentElements) {
      // Remove empty grid wrappers (very common in AEM export)
      const contentNodes = [];
      fragmentElements.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            node.matches('div') &&
            node.querySelector('.aem-Grid') &&
            node.textContent.trim() === ''
          ) {
            // skip empty grid
            return;
          }
        }
        // Include other nodes
        contentNodes.push(node);
      });
      // Remove whitespace-only text nodes
      const filtered = contentNodes.filter(n => {
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '') return false;
        return true;
      });
      content = (filtered.length === 1) ? filtered[0] : filtered;
    } else {
      // fallback: use the whole panel content
      const contentNodes = Array.from(panel.childNodes).filter(n => {
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '') return false;
        return true;
      });
      content = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    }
    // If it's an array with 0 length, make it an empty string
    if (Array.isArray(content) && content.length === 0) content = '';
    rows.push([label, content]);
  }

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
