/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element within the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the list of tab labels (in order)
  const tabLabelElements = tabsRoot.querySelectorAll('.cmp-tabs__tab');

  // Get all tab panels (in order)
  const tabPanelElements = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');

  // Defensive: skip if counts do not match
  if (tabLabelElements.length !== tabPanelElements.length) return;

  // Build the block table data
  // Header row: block name must match exactly
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // For each tab, a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabelElements.length; i++) {
    const label = tabLabelElements[i].textContent.trim();
    const panel = tabPanelElements[i];
    // Panel may contain elements with duplicate IDs, so to avoid DOM reparenting issues,
    // we reference the top-level tab panel element directly (as per instructions, do not clone)
    rows.push([label, panel]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the entire cmp-tabs block with the new block table
  tabsRoot.parentNode.replaceChild(table, tabsRoot);
}
