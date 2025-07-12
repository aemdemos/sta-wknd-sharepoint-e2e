/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (li's in .cmp-tabs__tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  if (!tabLabels.length) return;

  // Get all tab panels (order matters)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  if (!tabPanels.length) return;

  // Build the table
  const cells = [];
  // Header row: exactly one column, as in the example
  cells.push(['Tabs (tabs18)']);
  // Each row after header: [tab label, tab panel]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    if (panel.parentNode) panel.parentNode.removeChild(panel);
    cells.push([label, panel]);
  }
  // Create the table using the block utility
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table
  tabsBlock.replaceWith(block);
}
