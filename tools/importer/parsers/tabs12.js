/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 2. Extract tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }
  if (tabLabels.length === 0) return; // nothing to export

  // 3. Extract tab panels and content
  const tabPanels = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');
  if (tabPanels.length === 0) return;

  // 4. Map tab content to columns based on order
  const contents = [];
  tabPanels.forEach(panel => {
    // Prefer the article.cmp-contentfragment if present, else the .contentfragment, else panel
    let content = panel.querySelector('article.cmp-contentfragment');
    if (!content) content = panel.querySelector('.contentfragment');
    if (!content) content = panel;
    contents.push(content);
  });

  // Handle edge case: more tabs than content or vice versa
  // Always create as many columns as there are tab labels
  // Fill missing content columns with empty string
  const maxTabs = tabLabels.length;
  while (contents.length < maxTabs) contents.push(document.createTextNode(''));
  // If there are too many contents, trim extra
  if (contents.length > maxTabs) contents.length = maxTabs;

  // 5. Construct table rows
  // First row: header
  const headerRow = ['Tabs (tabs12)'];
  // Second row: tab labels (1 per column)
  // Third row: content for each tab (1 per column)
  const tableCells = [
    headerRow,
    tabLabels,
    contents,
  ];

  // 6. Create the table block
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // 7. Replace the original tabs block with the block table
  tabsRoot.replaceWith(table);
}
