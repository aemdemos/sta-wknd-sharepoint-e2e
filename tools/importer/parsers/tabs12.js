/* global WebImporter */
export default function parse(element, { document }) {
  // Find the top-level .cmp-tabs element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (from ol.cmp-tabs__tablist > li)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all tab panels (div.cmp-tabs__tabpanel, order matches tabLabels)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: If there are no tabs or panels, do not proceed
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row as per example: block name with variant
  const headerRow = ['Tabs (tabs12)'];

  // Each row: [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel, idx) => {
    const labelText = tabLabel.textContent.trim();
    // Get corresponding tabpanel (by order)
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return [labelText, ''];

    // Locate main content in tab panel:
    // Prefer article.cmp-contentfragment, else fallback to panel
    const mainContent = tabPanel.querySelector('article.cmp-contentfragment') || tabPanel;

    // Reference the existing mainContent element directly
    return [labelText, mainContent];
  });

  // Build the 2D cells array
  const cells = [headerRow, ...rows];

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs element in the DOM
  tabs.replaceWith(table);
}
