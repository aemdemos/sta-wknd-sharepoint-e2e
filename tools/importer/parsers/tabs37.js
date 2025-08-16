/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements in .cmp-tabs__tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (order in DOM matches order of tabs)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the header row as per requirements
  const cells = [
    ['Tabs (tabs37)']
  ];

  tabItems.forEach((tabItem, idx) => {
    // Tab label from li text
    const label = tabItem.textContent.trim();
    // Try to find panel by aria-controls
    let tabPanelId = tabItem.getAttribute('aria-controls');
    let panel = tabPanelId ? tabsBlock.querySelector('#' + tabPanelId) : tabPanels[idx];
    if (!panel && tabPanels.length > idx) panel = tabPanels[idx];
    
    // For content: Reference the main content, prioritizing direct contentfragment/article
    let contentNode = null;
    if (panel) {
      contentNode = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel.firstElementChild;
      // If panel is empty, fallback to itself
      if (!contentNode || (contentNode.childNodes.length === 0 && !contentNode.textContent.trim())) {
        contentNode = panel;
      }
    }
    // If contentNode is still null, fallback to empty string
    if (!contentNode) contentNode = '';
    cells.push([label, contentNode]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace tabs block with the table
  tabsBlock.replaceWith(table);
}
