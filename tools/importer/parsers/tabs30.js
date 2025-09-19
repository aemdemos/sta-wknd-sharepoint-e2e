/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs;
  if (tabsContainer && tabsContainer.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer;
  } else if (tabsContainer) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  } else {
    cmpTabs = element.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    let content = tabPanels[i];
    // Defensive: If panel not found, skip
    if (!content) continue;
    // For robustness, extract the main contentfragment/article inside the tabpanel
    let tabContent = content.querySelector('article') || content;
    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsContainer.replaceWith(table);
}
