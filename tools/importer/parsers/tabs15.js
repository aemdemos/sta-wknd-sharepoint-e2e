/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per spec
  rows.push(['Tabs (tabs15)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: Find the main content fragment/article inside the panel
    let content = null;
    // Try to find the contentfragment/article, else fallback to the panel itself
    content = panel.querySelector('.contentfragment, article, .cmp-contentfragment, .cmp-contentfragment__elements') || panel;

    // For robustness, if content is a .contentfragment, use its first child article if present
    if (content && content.classList.contains('contentfragment')) {
      const article = content.querySelector('article');
      if (article) content = article;
    }

    // Place the label and the content element in the row
    rows.push([
      label,
      content
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
