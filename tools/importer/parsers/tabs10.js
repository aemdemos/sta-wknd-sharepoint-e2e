/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (the actual tabs container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Header row: block name
  const headerRow = ['Tabs (tabs10)'];

  // Compose rows: each tab gets its label and content
  const rows = tabLabels.map((label, i) => {
    // Defensive: get panel if exists
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Use the whole panel content as a cell (reference, not clone)
      content = panel;
    }
    return [label, content];
  });

  // Compose final table
  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
