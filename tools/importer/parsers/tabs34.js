/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the provided element
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;

  const cmpTabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels in order
  const tabLabels = [];
  const tabList = cmpTabs.querySelector('ol.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach((tabEl) => {
      tabLabels.push(tabEl.textContent.trim());
    });
  }

  // Get all tab panels by their order in the DOM
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Build the header row, per block name in requirements
  const headerRow = ['Tabs (tabs34)'];
  const cells = [headerRow];

  // For each tab, add a row with: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent;
    // Try to reference the main content element for this tab
    if (panel) {
      // Most content is inside an <article> inside the tabpanel
      const article = panel.querySelector('article');
      if (article) {
        tabContent = article;
      } else {
        // Fallback: all content inside the tab panel
        tabContent = panel;
      }
    } else {
      tabContent = '';
    }
    cells.push([tabLabel, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table
  tabsWrapper.replaceWith(table);
}
