/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Table rows: header first
  const rows = [];
  const headerRow = ['Tabs (tabs34)'];
  rows.push(headerRow);

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, idx) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    if (!panel) return;
    // Find the main contentfragment/article inside panel
    let tabContent = panel.querySelector('.cmp-contentfragment, article, .contentfragment');
    if (!tabContent) {
      // fallback: use panel itself
      tabContent = panel;
    }
    // Use the actual referenced element, not a clone
    rows.push([label, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(block);
}
