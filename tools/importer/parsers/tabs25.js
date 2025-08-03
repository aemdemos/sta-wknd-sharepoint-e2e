/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get each tab's content (panel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // For each tab, get the direct HTML content of the tab panel (array of nodes or single node)
  const tabContents = tabPanels.map(panel => {
    const nodes = Array.from(panel.childNodes).filter(
      n => !(n.nodeType === 3 && !n.textContent.trim())
    );
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) return nodes;
    return '';
  });

  // Table format: header in first row, tab label row, tab content row
  const table = [
    ['Tabs (tabs25)'],
    tabLabels,
    tabContents
  ];

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
