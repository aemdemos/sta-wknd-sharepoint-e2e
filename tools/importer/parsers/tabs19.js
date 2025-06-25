/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Tabs block by .cmp-tabs
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (tab headers)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim()) : [];

  // Find all tabpanel elements (content for each tab)
  const tabPanels = tabLabels.map(label => {
    // Find the tab <li> by label, then get its aria-controls to find the tabpanel
    const tab = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).find(t => t.textContent.trim() === label);
    if (tab && tab.hasAttribute('aria-controls')) {
      const tabPanelId = tab.getAttribute('aria-controls');
      const tabPanel = tabsBlock.querySelector(`#${tabPanelId}`);
      return tabPanel;
    }
    return null;
  });

  // Compose the header row (block name, exactly as required)
  const headerRow = ['Tabs (tabs19)'];

  // Compose the label row (labels, 1 cell per tab)
  const labelRow = tabLabels;

  // Compose the content row(s): 1 row, 1 cell per tab content
  // Each cell should reference the content node(s) of the corresponding tab panel
  const contentRow = tabPanels.map(tabPanel => {
    if (!tabPanel) return '';
    // Collect all children except script/style, use existing elements (not clones)
    const nodes = Array.from(tabPanel.childNodes).filter(node => {
      return !(node.nodeType === 1 && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE')) &&
             !(node.nodeType === 3 && node.textContent.trim() === '');
    });
    if (nodes.length === 1) {
      return nodes[0];
    } else if (nodes.length > 1) {
      return nodes;
    } else {
      return '';
    }
  });

  // Compose the cells array as: [headerRow], [labelRow], [contentRow]
  const cells = [headerRow, labelRow, contentRow];

  // Create table and replace original tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
