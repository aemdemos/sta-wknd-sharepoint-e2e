/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs22)'];

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if both arrays are present and have same length
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Build rows for each tab
  const rows = tabLabels.map((tabLabel, i) => {
    // Defensive: Get corresponding panel
    const panel = tabPanels[i];
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // For tab content, reference the entire tabpanel's content
    // Find the .contentfragment inside the panel (usually only one)
    const contentFragment = panel.querySelector('.contentfragment') || panel;

    // Place label and content in cells
    return [labelText, contentFragment];
  });

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
