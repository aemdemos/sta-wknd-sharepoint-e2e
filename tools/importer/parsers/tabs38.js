/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (main tabs container)
  const cmpTabs = tabsBlock.classList.contains('cmp-tabs') ? tabsBlock : tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));
  if (!tabPanels.length) return;

  // Compose rows: header, then one row per tab
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs38)']);

  // For each tab, find its label and content
  tabLabels.forEach((tabLabel) => {
    const labelText = tabLabel.textContent.trim();
    // Find the corresponding tabpanel by aria-controls/id
    const tabPanelId = tabLabel.getAttribute('aria-controls');
    const tabPanel = cmpTabs.querySelector(`#${tabPanelId}`);
    let tabContent = null;
    if (tabPanel) {
      // Reference all child nodes that contain actual content
      tabPanel.removeAttribute('aria-hidden');
      const contentNodes = Array.from(tabPanel.childNodes).filter(n => {
        // Filter out empty text nodes
        return !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim());
      });
      // If only one element, just use it, else use array
      tabContent = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
