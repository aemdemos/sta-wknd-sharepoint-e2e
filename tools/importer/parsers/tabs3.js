/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Extract tab labels and tab panels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children).map(tab => tab.textContent.trim()) : [];
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  const cells = [];
  // Header row: exactly one column, block name
  cells.push(['Tabs (tabs3)']);

  // For each tab: one row, two columns: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabPanel = tabPanels[i];
    let contentEl = '';
    // Prefer the article/contentfragment within the tabPanel, else use the tabPanel itself
    if (tabPanel) {
      contentEl = tabPanel.querySelector('article') || tabPanel;
    }
    cells.push([label, contentEl]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs element with the new block
  tabs.replaceWith(block);
}