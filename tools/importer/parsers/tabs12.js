/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) cmpTabs = tabsContainer;
  if (!cmpTabs) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab content panels (in order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If no tabs found, abort
  if (!tabLabels.length || !tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Corresponding panel
    const panel = tabPanels[i];
    if (!panel) return;

    // Defensive: Find the main content fragment/article inside the panel
    let content = panel.querySelector('.cmp-contentfragment, article, .cmp-contentfragment__elements');
    if (!content) {
      // If not found, fallback to panel itself
      content = panel;
    }

    // Place the tab label and content in the row
    rows.push([
      label,
      content
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
