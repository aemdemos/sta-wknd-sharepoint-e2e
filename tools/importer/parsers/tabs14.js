/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabLabelEls = tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // Get all tab panels (in document order)
  const tabPanelEls = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Set up table rows
  const rows = [];
  rows.push(['Tabs (tabs14)']); // Header row EXACTLY from example

  // For each tab, get the label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanelEls[i];
    let content = '';

    if (panel) {
      // Try to reference the main content fragment/article for the tab
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // If no article found, reference the panel itself
        content = panel;
      }
    }
    rows.push([label, content]);
  }

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
