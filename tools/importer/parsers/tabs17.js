/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block inside the element
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const tabsContainer = tabsWrapper.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels
  const tabList = tabsContainer.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Extract tab panels (in DOM order)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the table rows
  const rows = [];
  // Header row: block name as example specifies
  rows.push(["Tabs (tabs17)"]);
  
  // Each tab row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue; // Defensive: skip missing data
    // Try to extract the relevant content block inside the panel
    // Use the .contentfragment/article if present, otherwise the whole panel
    let tabContent = panel.querySelector('article.cmp-contentfragment, .contentfragment');
    if (!tabContent) tabContent = panel;
    rows.push([label, tabContent]);
  }

  // Create the tabs block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs section with the new table
  tabsWrapper.replaceWith(table);
}
