/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the parent tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  tabList && tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
    tabLabels.push(tab.textContent.trim());
  });

  // Get all panels (tab content)
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');

  // Compose table header
  const headerRow = ['Tabs (tabs30)'];

  // Compose tab rows: [label, content element]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let contentCell;
    if (tabPanels[i]) {
      // Prefer the article (contentfragment) if present
      const cf = tabPanels[i].querySelector('article.cmp-contentfragment');
      contentCell = cf || tabPanels[i]; // reference DOM node directly
    } else {
      // If missing, use empty div
      contentCell = document.createElement('div');
    }
    rows.push([label, contentCell]);
  }

  // Make the table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
