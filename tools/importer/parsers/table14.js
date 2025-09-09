/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the tabbed content area)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (!tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row: always block name
  const headerRow = ['Table (table14)'];
  rows.push(headerRow);

  // Data row: each tab panel's content in a column
  const dataRow = tabPanels.map(panel => {
    // Try to find the main article/contentfragment inside the panel
    const article = panel.querySelector('article, .cmp-contentfragment');
    if (article) {
      return article;
    }
    // Fallback: use the whole panel
    return panel;
  });
  rows.push(dataRow);

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the new table
  tabs.replaceWith(table);
}
