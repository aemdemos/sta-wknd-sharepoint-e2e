/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(tab => tab.textContent.trim());
  }

  // Get the tabpanels (contents for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  // Make sure we match tab labels and tab panels count
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Compose the tabs header row
  const tabsHeaderRow = tabLabels.slice(0, numTabs);
  // Compose the tabs content row
  const tabContentRow = [];
  for (let i = 0; i < numTabs; i++) {
    const tabPanel = tabPanels[i];
    // The content for this tab: take all content inside the tabpanel (usually one .contentfragment)
    let content = null;
    // Prefer .contentfragment or the article inside
    const cf = tabPanel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (cf) {
      content = cf;
    } else {
      // Otherwise, use all child elements/nodes
      const nodes = Array.from(tabPanel.childNodes).filter(n => (n.nodeType === 1 && n.tagName !== 'SCRIPT') || (n.nodeType === 3 && n.textContent.trim() !== ''));
      if (nodes.length === 1) {
        content = nodes[0];
      } else if (nodes.length > 1) {
        content = nodes;
      } else {
        // fallback to empty string if no content
        content = '';
      }
    }
    tabContentRow.push(content);
  }

  // Compose the block cells: first row is header, then the tab labels row, then the content row
  const cells = [
    ['Tabs (tabs36)'],
    tabsHeaderRow,
    tabContentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
