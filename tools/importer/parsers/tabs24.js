/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Get tab panels in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Table header row (block name)
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;

    // Tab label cell
    const labelCell = label;

    // Tab content cell: get all direct children of the panel
    // Usually a .contentfragment, but could be other blocks
    // We'll grab everything inside the panel
    const tabContentElements = Array.from(panel.childNodes).filter(
      node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
    );

    // If only one element, use it directly; else, array
    let contentCell;
    if (tabContentElements.length === 1) {
      contentCell = tabContentElements[0];
    } else {
      contentCell = tabContentElements;
    }

    rows.push([labelCell, contentCell]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
