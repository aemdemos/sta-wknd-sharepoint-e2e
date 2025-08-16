/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (ordered)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);

  // Get all tabpanel elements in order
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Prepare rows for table block
  const tableRows = [];
  // Header row (block name from spec)
  tableRows.push(['Tabs (tabs30)']);

  // For each tab, collect label and content. Guarantee matching order.
  for (let i = 0; i < tabLabelEls.length; i++) {
    // Tab label text
    const label = tabLabelEls[i] ? tabLabelEls[i].textContent.trim() : '';
    // Tab content extraction
    let tabContent = '';
    // The tab panel for this tab
    const panel = tabPanels[i];
    if (panel) {
      // Try to reference the main article (contentfragment) inside the panel
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        tabContent = cf;
      } else {
        // If not found, use all children of the tabpanel
        // Use an array of its direct children, for robustness
        const childNodes = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
        tabContent = childNodes.length === 1 ? childNodes[0] : childNodes.length ? childNodes : '';
      }
    }
    tableRows.push([label, tabContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original tabs block only (not the whole element)
  tabs.replaceWith(blockTable);
}
