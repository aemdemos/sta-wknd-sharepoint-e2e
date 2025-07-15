/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs container inside the given element
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs (the main tab structure)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);
  
  // Get all tabpanel elements (order should match labels)
  const tabPanelEls = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  
  // Build the first row: block name
  const table = [['Tabs (tabs20)']];

  // For each tab, add a row: [TabLabel, ContentElement(s)]
  for (let i = 0; i < tabLabelEls.length; i++) {
    // Extract tab label (text, trimmed)
    const label = tabLabelEls[i]?.textContent?.trim() || '';

    // Extract tab content (i.e. everything inside the tabpanel)
    let content = '';
    const panel = tabPanelEls[i];
    if (panel) {
      // We want to include all contents inside the tabpanel
      // If there is only one child node, use it; else use the array
      // Remove aria/role attributes from the tabPanel (but keep children)
      const panelContentNodes = Array.from(panel.childNodes).filter(
        n => (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()))
      );
      if (panelContentNodes.length === 1) {
        content = panelContentNodes[0];
      } else if (panelContentNodes.length > 1) {
        content = panelContentNodes;
      } else {
        content = '';
      }
    }

    table.push([label, content]);
  }

  // Create the block table and replace the original tabs container
  const block = WebImporter.DOMUtils.createTable(table, document);
  tabsContainer.replaceWith(block);
}
