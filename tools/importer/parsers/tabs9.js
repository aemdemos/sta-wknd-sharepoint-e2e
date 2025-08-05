/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // 1. Extract tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      // Use the text content, trimmed
      tabLabels.push(tab.textContent.trim());
    });
  }

  // 2. Extract tab panel content, in order
  // Each tabpanel is a .cmp-tabs__tabpanel; order matches tabLabels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  const rows = [];
  for (let i = 0; i < tabPanels.length; i++) {
    const panel = tabPanels[i];
    // Defensive: if tab label is missing, generate fallback label
    const label = tabLabels[i] || `Tab ${i+1}`;

    // The content to display per tab:
    // Prefer the contentfragment article if present, otherwise the panel itself
    let content = null;
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // fallback: all direct children except empty grids
      // but in this HTML, fall back to the panel
      content = panel;
    }
    rows.push([label, content]);
  }

  // Header row must match block name exactly
  const tableRows = [
    ['Tabs (tabs9)'],
    ...rows
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
