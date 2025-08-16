/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tabs list
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabItems = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);
  const tabLabels = tabItems.map(tab => tab.textContent.trim());

  // Get all tab panels (tab contents)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Defensive: the order of tabPanels should match tabLabels

  // Compose the rows: header, then each tab label + tab content
  const headerRow = ['Tabs (tabs28)'];
  const contentRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent;
    if (panel) {
      // Reference the main content fragment in the tab panel (if present), else the whole panel
      // The contentfragment/article is usually the container for the tab's content
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      tabContent = contentFragment ? contentFragment : panel;
    } else {
      tabContent = document.createTextNode('');
    }
    contentRows.push([label, tabContent]);
  }

  // Build the table array
  const cells = [headerRow, ...contentRows];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
