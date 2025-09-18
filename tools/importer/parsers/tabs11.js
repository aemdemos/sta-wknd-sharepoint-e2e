/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure tabs and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row per spec
  rows.push(['Tabs (tabs11)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: find the main content fragment/article inside the panel
    let tabContent = null;
    // Prefer the article/contentfragment if present
    tabContent = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment') || panel;

    // Clone the content to avoid moving it from the DOM
    let contentCell = tabContent.cloneNode(true);

    rows.push([
      label,
      contentCell
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Remove the original element from the DOM to ensure modification
  element.parentNode.replaceChild(table, element);
}
