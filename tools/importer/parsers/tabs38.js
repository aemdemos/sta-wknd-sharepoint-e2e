/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block in the element
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels in order
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());
  const numTabs = tabLabels.length;
  if (!numTabs) return;

  // Get tabpanels (ordered)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));
  if (tabPanels.length !== numTabs) return;

  // Compose the header row (block name), then labels as header row, then ONE row with all tab content in the correct column order
  const headerRow = ['Tabs (tabs38)'];
  const tabLabelsRow = tabLabels;
  const tabContentRow = tabPanels.map((tabPanel) => {
    // Try to find the main content/article in this tabPanel
    let contentElem = tabPanel.querySelector('article');
    if (!contentElem) {
      // Try to get the first non-empty div inside
      const divs = Array.from(tabPanel.querySelectorAll('div'));
      contentElem = divs.find(div => div.textContent.trim()) || tabPanel;
    }
    return contentElem;
  });
  
  // The table should be:
  // [ [header], [tab1, tab2, ...], [content1, content2, ...] ]
  const cells = [headerRow, tabLabelsRow, tabContentRow];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
