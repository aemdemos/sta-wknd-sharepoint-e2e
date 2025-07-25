/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('ol.cmp-tabs__tablist');
  const tabLabelElements = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Get tab panels in order (one per tab)
  const panelElements = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  // Build rows: each tab label and its content as a new row (never a single row with all labels)
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = panelElements[i];
    let tabContent = '';
    if (panel) {
      // Try to use the article, otherwise use all children
      let article = panel.querySelector('article');
      if (article) {
        tabContent = article;
      } else {
        // fallback: combine all children
        const frag = document.createElement('div');
        Array.from(panel.childNodes).forEach(node => frag.appendChild(node));
        tabContent = frag;
      }
    }
    rows.push([label, tabContent]);
  }

  // Header row: single cell, block name exactly as in example
  const headerRow = ['Tabs (tabs33)'];

  // Compose cells: first header row, then tab rows
  const cells = [headerRow, ...rows];

  // Create table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
