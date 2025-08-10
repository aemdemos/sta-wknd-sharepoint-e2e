/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tabEl => {
      tabLabels.push(tabEl.textContent.trim());
    });
  }

  // Get tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Header row: single cell, block name
  const tableRows = [['Tabs (tabs37)']];

  // Each tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Get the main article/content fragment for robustness
    const article = panel.querySelector('article');
    let contentCell = article || panel;
    tableRows.push([label, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
