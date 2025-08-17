/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block within the provided element
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;

  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab list (labels)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get all tab panels, in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the table header row
  const headerRow = ['Tabs (tabs31)'];
  // Compose the tab label row (second row, each label in its cell)
  const tabsRow = tabLabels;

  // Compose one row for each tab, with two cells: label and content
  // Each row: [tab label as string, tab content as element]
  const contentRows = tabLabels.map((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return [label, ''];
    const article = panel.querySelector('article');
    const tabContent = article ? article : panel;
    return [label, tabContent];
  });

  // Compose the complete table structure
  const cells = [headerRow, tabsRow, ...contentRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the generated table
  tabsContainer.replaceWith(block);
}
