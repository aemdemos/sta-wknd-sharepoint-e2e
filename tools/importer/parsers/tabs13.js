/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: div with class 'cmp-tabs'
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]')).map(tabEl => tabEl.textContent.trim());

  // Find tab panels in DOM order (should match tab labels)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build header row from block name - single cell
  const headerRow = ['Tabs (tabs13)'];

  // Build the column header row (tab labels)
  const labelRow = tabLabels;

  // For each tab, create a row with the tab content only in its column, others empty
  const contentRows = tabPanels.map((panel, i) => {
    const row = tabLabels.map(() => ''); // fill with empty strings first
    // Prefer contentfragment/article in the tab panel, else use the panel content directly
    const contentFragment = panel.querySelector('article');
    const content = contentFragment ? contentFragment : panel;
    row[i] = content;
    return row;
  });

  // Compose final table cells array
  const cells = [headerRow, labelRow, ...contentRows];

  // Create the table and replace the tabs block in the DOM
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
