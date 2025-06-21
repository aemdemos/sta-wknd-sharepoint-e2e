/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels as columns
  const tabLabels = [];
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab content as columns
  const tabContents = [];
  const tabPanels = tabsBlock.querySelectorAll('[role="tabpanel"]');
  tabPanels.forEach(panel => {
    const nodes = Array.from(panel.childNodes).filter(n => (
      !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim())
    ));
    if (nodes.length === 1) {
      tabContents.push(nodes[0]);
    } else if (nodes.length > 1) {
      tabContents.push(nodes);
    } else {
      tabContents.push('');
    }
  });

  // Only process if there is content
  if (tabLabels.length === 0 || tabContents.length === 0) return;

  // Compose the table as specified: header, label row, content row
  const cells = [
    ['Tabs (tabs23)'],
    tabLabels,
    tabContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
