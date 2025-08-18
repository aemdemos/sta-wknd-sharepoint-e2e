/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab label elements (li)
  const tabLabelElements = tabsBlock.querySelectorAll('.cmp-tabs__tablist > li');
  // Get tab panel elements (divs with role="tabpanel")
  const tabPanelElements = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');

  // If no tabs found, do nothing
  if (!tabLabelElements.length || !tabPanelElements.length) return;

  // Build the table header row exactly as required
  const headerRow = ['Tabs (tabs7)'];

  // Build per-tab rows: each row is [tab label, tab content]
  const rows = Array.from(tabLabelElements).map((tab, i) => {
    const label = tab.textContent.trim();
    let content = null;
    if (tabPanelElements[i]) {
      content = tabPanelElements[i].querySelector('.contentfragment') || tabPanelElements[i];
    }
    return [label, content];
  });

  // Compose final table data: header row, then tab rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the block table
  tabsBlock.replaceWith(blockTable);
}
