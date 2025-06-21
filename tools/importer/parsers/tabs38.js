/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels in order
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(li => li.textContent.trim());

  // Extract the tab panel content in order
  const tabPanels = Array.from(tabsContainer.querySelectorAll('div[role="tabpanel"]'));

  // Prepare header row
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each tab, compose a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Reference the contentfragment article if present, else use the whole panel
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        contentCell = contentFragment;
      } else {
        contentCell = panel;
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the block table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabsContainer with the table
  tabsContainer.replaceWith(table);
}
