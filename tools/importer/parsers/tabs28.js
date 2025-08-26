/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find tab labels and corresponding tab panels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  const tabPanels = Array.from(tabs.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row as required by example
  const rows = [['Tabs (tabs28)']];

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label (using HTML element for semantic structure)
    const label = document.createElement('strong');
    label.textContent = tabLabels[i].textContent.trim();

    // Tab content: reference the first child of the panel that has meaningful content
    // Use the article.cmp-contentfragment if present, otherwise fallback to the tabpanel itself
    const tabPanel = tabPanels[i];
    let contentElement = tabPanel.querySelector('article.cmp-contentfragment');
    if (!contentElement) {
      // Fallback: find the main content fragment inside this panel
      contentElement = tabPanel;
    }

    rows.push([label, contentElement]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabs.replaceWith(table);
}
