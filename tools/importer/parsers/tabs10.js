/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block in the provided element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from li.cmp-tabs__tab (in the order shown in the tablist)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map((li) => li.textContent.trim());

  // Get all tabpanels in order (children of tabsContainer)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Compose the cells array for the table
  const cells = [];

  // Header row with block name
  cells.push(['Tabs (tabs10)']);

  // For each tab, add a row [tabLabel, tabContent]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Try to extract main content in the tab panel
    // If there is a .contentfragment, use it; otherwise use the panel's content
    let content = panel.querySelector('.contentfragment');
    if (!content) {
      // If no .contentfragment, check if there's a direct article or just use panel
      content = panel.querySelector('article') || panel;
    }
    cells.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with new block table
  tabsContainer.replaceWith(block);
}
