/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first '.cmp-tabs' inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find all the tab labels (li elements inside the tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Find all tab panels (by role=tabpanel)
  const tabPanels = {};
  tabs.querySelectorAll('.cmp-tabs__tabpanel').forEach(panel => {
    const tabId = panel.getAttribute('aria-labelledby');
    if (tabId) tabPanels[tabId] = panel;
  });

  // Build the block table cells
  const cells = [];
  // Header row (exact block name as per requirement)
  cells.push(['Tabs (tabs15)']);

  // For each tab label, find the corresponding panel and content
  tabLabels.forEach(tab => {
    const label = tab.textContent ? tab.textContent.trim() : '';
    const tabId = tab.getAttribute('id');
    let contentCell = '';
    if (tabId && tabPanels[tabId]) {
      // Reference all direct element children (preserves lists, headers, images, etc.)
      const panel = tabPanels[tabId];
      // Remove empty text nodes but preserve all actual elements
      const contentNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
        return false;
      });
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        contentCell = '';
      }
    }
    cells.push([label, contentCell]);
  });

  // Create the block table and replace the original tabs element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
