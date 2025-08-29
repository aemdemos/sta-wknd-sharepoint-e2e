/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block by looking for the cmp-tabs class
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;
  // Get all tab labels and the corresponding content panels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  // Get the order of tabs from the tablist
  const tabNodes = Array.from(tabList.querySelectorAll('[role="tab"]'));
  // Prepare to get the corresponding panels by aria-controls
  const rows = [];
  // Header row (block name exactly as required)
  rows.push(['Tabs (tabs14)']);
  // For each tab, get the label and corresponding panel
  tabNodes.forEach((tabNode) => {
    const label = tabNode.textContent.trim();
    // The tab panel id is in aria-controls
    const panelId = tabNode.getAttribute('aria-controls');
    // Find the tab panel
    const panel = tabsContainer.querySelector(`#${panelId}`);
    let tabContent = null;
    if (panel) {
      // Collect all meaningful child nodes (excluding empty text nodes)
      const contentNodes = [];
      Array.from(panel.childNodes).forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0)) {
          contentNodes.push(n);
        }
      });
      // For typical structure, there's one contentfragment div per panel, but in case of more, include all meaningful nodes
      if (contentNodes.length === 1) {
        tabContent = contentNodes[0];
      } else if (contentNodes.length > 1) {
        tabContent = contentNodes;
      } else {
        tabContent = '';
      }
    } else {
      tabContent = '';
    }
    rows.push([label, tabContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
