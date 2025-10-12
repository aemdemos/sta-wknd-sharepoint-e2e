/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) cmpTabs = tabsContainer;
  if (!cmpTabs) return;

  // Get tab labels (tab triggers)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If no tabs found, do nothing
  if (!tabLabels.length || !tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs20)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Defensive: Find the matching panel by index
    const panel = tabPanels[idx];
    if (!panel) return;

    // Extract the visible tab content
    // We'll grab the whole contentfragment/article inside each panel
    const contentFragment = panel.querySelector('.cmp-contentfragment, article') || panel;

    // Defensive: If no content, skip
    if (!contentFragment) return;

    rows.push([
      labelText,
      contentFragment
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
