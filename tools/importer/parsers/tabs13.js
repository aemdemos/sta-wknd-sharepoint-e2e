/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class name
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs container inside tabsRoot
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Grab tab labels (always in .cmp-tabs__tablist > .cmp-tabs__tab)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Grab tab panels (these are in the same order as tabLabels)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // For each tab panel, find the main article with the tab's content
  // If not found, fallback to the panel itself
  const tabContents = tabPanels.map(panel => {
    const article = panel.querySelector('article');
    return article ? article : panel;
  });

  // Compose the table as per the markdown example:
  // 1. First row: Header - block name (Tabs (tabs13))
  // 2. Second row: Tab labels (multiple columns)
  // 3rd row: Tab contents (multiple columns, all in the same row)
  const cells = [
    ['Tabs (tabs13)'],
    tabLabels,
    tabContents
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(blockTable);
}
