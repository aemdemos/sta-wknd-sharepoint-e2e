/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and tab panels
  const tabLabels = Array.from(tabsBlock.querySelectorAll(':scope > .cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll(':scope > .cmp-tabs__tabpanel'));
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Compose the header row
  const cells = [['Tabs (tabs8)']];

  // For each tab, make a row with [label, content], referencing existing elements
  for (let i = 0; i < tabLabels.length; i++) {
    const labelCell = document.createElement('span');
    labelCell.textContent = tabLabels[i].textContent.trim();
    let contentCell = tabPanels[i].querySelector(':scope > .contentfragment') || tabPanels[i];
    cells.push([labelCell, contentCell]);
  }

  // Create and replace the block with the new table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
