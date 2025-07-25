/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the cmp-tabs__tablist > li
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabItems = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  // If no tab labels, abort
  if (!tabItems.length) return;

  // Get all tab panel elements (cmp-tabs__tabpanel)
  // Each tabpanel has a data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // If no panels, abort
  if (!tabPanels.length) return;

  // Defensive: If panels and tabs count don't match, try to align them by their order
  const minCount = Math.min(tabItems.length, tabPanels.length);

  // Prepare the cells array for the table block
  // Header row: ['Tabs (tabs23)']
  const headerRow = ['Tabs (tabs23)'];
  // Second row: tab labels in columns
  const tabLabelsRow = tabItems.slice(0, minCount).map(tab => {
    // Use textContent, trim whitespace
    return tab.textContent.trim();
  });
  // Third row: tab content, one column per tab, matching order
  const tabContentRow = tabPanels.slice(0, minCount).map(tabPanel => {
    // Use the main content element for the panel
    // We'll use the article if available, else use the inner div with class 'contentfragment', else the panel itself
    let content = tabPanel.querySelector('article');
    if (content) return content;
    content = tabPanel.querySelector('.contentfragment');
    if (content) return content;
    return tabPanel;
  });

  // Build the block table as per the example: header (single cell), then tab labels row, then tab content row
  const cells = [
    headerRow,
    tabLabelsRow,
    tabContentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabsBlock with the new table
  tabsBlock.replaceWith(block);
}
