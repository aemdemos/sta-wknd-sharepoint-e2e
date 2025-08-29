/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block (.cmp-tabs is always present)
  let tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels in order
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (contents) in order
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Build cells: header first
  const cells = [['Tabs (tabs30)']];

  // Add a row for each tab
  for (let i = 0; i < tabPanels.length; i++) {
    const label = tabLabels[i] || `Tab ${i+1}`;
    // Reference the main contentfragment/article inside each panel (if present)
    let tabContent = tabPanels[i];
    const cf = tabPanels[i].querySelector('article.cmp-contentfragment');
    if (cf) tabContent = cf;
    cells.push([label, tabContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table (reference, don't clone)
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
