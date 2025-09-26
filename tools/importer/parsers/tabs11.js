/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"]')
  );

  // Build header row
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];

  // For each tab, build a row: [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    // Defensive: Find matching tabpanel
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: grab the main contentfragment/article inside the tabpanel
    let tabContent = tabPanel.querySelector('article') || tabPanel;

    // For resilience, if the tab content is deeply nested, grab the main content fragment
    // If not found, fallback to tabPanel itself
    rows.push([
      labelText,
      tabContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs container with the block
  tabsContainer.parentNode.replaceChild(block, tabsContainer);
}
