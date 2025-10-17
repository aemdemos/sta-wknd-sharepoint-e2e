/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (tab headers)
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (tab contents)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only continue if we have matching number of tabs and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row as required
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: If there are fewer panels than tabs, skip
    if (!tabPanels[i]) continue;
    // Use the entire tab panel content as the cell
    rows.push([
      label,
      tabPanels[i]
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs container with the table
  tabsContainer.replaceWith(table);
}
