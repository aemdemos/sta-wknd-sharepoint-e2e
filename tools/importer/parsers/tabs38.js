/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);
  if (tabLabels.length === 0) return;

  // Find all tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabPanels.length === 0) return;

  // Compose header row (block name exactly as in requirements)
  const headerRow = ['Tabs (tabs38)'];

  // Compose tab label row in order
  const labelRow = tabLabels.map(label => label.textContent.trim());

  // Compose tab content row, referencing existing elements (not clones)
  // Use the main .cmp-contentfragment__elements or fallback to the panel
  const contentRow = tabPanels.map(panel => {
    // Try to reference the main .cmp-contentfragment__elements in the panel
    const fragElem = panel.querySelector('.cmp-contentfragment__elements');
    if (fragElem && fragElem.children.length > 0 && fragElem.textContent.trim() !== '') {
      return fragElem;
    }
    // Otherwise fallback to all content in the tab panel
    // But reference the panel, not clone
    return panel;
  });

  // Compose the table data: header, labels, content rows
  const tableData = [
    headerRow,
    labelRow,
    contentRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabsBlock with the new block table
  tabsBlock.replaceWith(block);
}
