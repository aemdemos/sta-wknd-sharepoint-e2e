/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelNodes = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (!tabLabelNodes.length) return;
  const tabLabels = tabLabelNodes.map(tab => tab.textContent.trim());

  // Extract tab panel contents
  const panelNodes = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  if (panelNodes.length !== tabLabels.length) return;
  const tabContents = panelNodes.map(panel => {
    // Prefer main article.cmp-contentfragment, else use panel itself
    const article = panel.querySelector('article.cmp-contentfragment');
    return article || panel;
  });

  // Compose table rows as per example:
  // First row: header, single cell
  // Second row: tab labels, each in one column
  // Third row: tab contents, each in one column corresponding to label
  const rows = [];
  rows.push(['Tabs (tabs37)']);
  rows.push(tabLabels);
  rows.push(tabContents);

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
