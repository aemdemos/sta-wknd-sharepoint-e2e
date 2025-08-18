/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li nodes)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (same order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Table header row: exactly one column with block name
  const cells = [['Tabs (tabs36)']];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    let content = tabPanels[i]?.querySelector('article.cmp-contentfragment') || tabPanels[i];
    cells.push([label, content]);
  }

  // Create the table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(blockTable);
}
