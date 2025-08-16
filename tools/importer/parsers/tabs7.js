/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels and panels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only build rows when labels and panels match
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Header row: Block name, single cell
  const headerRow = ['Tabs (tabs7)'];

  // Each tab row: [label, content]
  const tabRows = tabLabels.map((label, idx) => {
    // Convert <li> or other elements to <span> for clean table display
    let labelElem = label;
    if (label.tagName !== 'SPAN') {
      labelElem = document.createElement('span');
      labelElem.textContent = label.textContent.trim();
    }
    // Tab content: use the main contentfragment/article inside each panel
    const tabPanel = tabPanels[idx];
    const content = tabPanel.querySelector('.contentfragment, article, .cmp-contentfragment') || tabPanel;
    return [labelElem, content];
  });

  // Compose block table
  const cells = [headerRow, ...tabRows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
