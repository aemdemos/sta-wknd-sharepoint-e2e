/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block (the tab component root) within the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (<li> elements inside the tablist <ol>)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList || tabList.children.length === 0) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());

  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Ensure we have the same number of labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Header row: block name (follow example EXACTLY)
  const tableRows = [ ['Tabs (tabs25)'] ];

  // For each tab, create a row: [tabLabel, tabContent]
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Use a container div to hold all content from the panel for resilience
    const contentContainer = document.createElement('div');
    while (panel.firstChild) {
      contentContainer.appendChild(panel.firstChild);
    }
    tableRows.push([label, contentContainer]);
  }

  // Create the block table using the helper function
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the tabs block in the DOM
  tabsRoot.replaceWith(table);
}
