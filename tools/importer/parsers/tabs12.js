/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the current element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tab list
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []).map(tab => tab.textContent.trim());

  // Get all the tab panels in the order they appear
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the header row as in the example
  const rows = [['Tabs (tabs12)']];

  // For each tab, add a row with [Tab Label, Content], referencing the full tab content element
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // For robustness, get the main contentfragment/article if present, else the whole tabpanel
    let tabContent = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (!tabContent) tabContent = panel;
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with our table
  tabsBlock.replaceWith(block);
}
