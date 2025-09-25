/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element (holds tab labels and panels)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: tabLabels and tabPanels should match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: If label is empty, skip
    if (!label) continue;

    // Tab content: Use the full tabpanel content
    const panel = tabPanels[i];
    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // Create a cell for the tab label (string)
    // Create a cell for the tab content (element)
    rows.push([label, panel]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs container with the block table
  tabsContainer.replaceWith(block);
}
