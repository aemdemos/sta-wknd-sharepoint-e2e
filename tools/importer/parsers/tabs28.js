/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (the block with class 'tabs' containing '.cmp-tabs')
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());
  }

  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose header row (block name as in requirements)
  const headerRow = ['Tabs (tabs28)'];

  // Compose tab labels row (tab labels as columns)
  const labelsRow = tabLabels;

  // Compose a row of tab contents, referencing the content elements directly (not cloning)
  const contentRow = tabPanels.map(panel => {
    // Find the main content for each tab: prefer the <article> if present, else the panel itself
    const article = panel.querySelector('article');
    // Remove any aria-hidden or tabpanel classes that would hide content
    if (panel.hasAttribute('aria-hidden')) panel.removeAttribute('aria-hidden');
    if (panel.classList.contains('cmp-tabs__tabpanel--active')) {
      panel.classList.remove('cmp-tabs__tabpanel--active');
    }
    return article ? article : panel;
  });

  // Compose the table cells as required: header, label row, content row
  const cells = [headerRow, labelsRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original .tabs block with the new table
  tabsBlock.replaceWith(block);
}
