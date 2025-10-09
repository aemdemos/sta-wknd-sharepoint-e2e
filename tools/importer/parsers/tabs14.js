/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements in tablist)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only process if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build table rows
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // For robustness, use the whole panel content as the cell
    rows.push([label, panel]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
