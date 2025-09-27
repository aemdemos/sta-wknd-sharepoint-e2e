/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (the one with cmp-tabs)
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: match labels to panels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Table header row
  const headerRow = ['Tabs (tabs17)'];
  const tableRows = [headerRow];

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: find the main contentfragment/article inside the tabpanel
    let content = null;
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // fallback: use the whole panel
      content = panel;
    }
    tableRows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
