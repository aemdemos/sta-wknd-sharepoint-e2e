/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (order matters)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (order should match tabLabels)
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure same number of tabs and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs9)']);

  // Each tab: label in first cell, content in second
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // For content, try to grab the main content fragment/article inside the panel
    let content = null;
    // Try to find a contentfragment/article
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // Fallback: use the whole panel content
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the table
  tabs.replaceWith(table);
}
