/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header
  const headerRow = ['Tabs (tabs29)'];
  const rows = [headerRow];

  // For each tab, create a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];
    if (!panel) return;

    // Find the main content fragment/article inside the panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel;

    // Reference the actual element, not clone
    rows.push([labelText, contentFragment]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs container with the block table
  tabsContainer.replaceWith(block);
}
