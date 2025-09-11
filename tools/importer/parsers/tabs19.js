/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements inside the tablist)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row as per block spec
  rows.push(['Tabs (tabs19)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: Get the corresponding tab panel
    const panel = tabPanels[i];
    if (!panel) continue;

    // For tab content, grab the entire contentfragment/article inside the panel
    // (This is robust to variations and preserves structure)
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel;

    rows.push([
      label,
      contentFragment
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the new table
  tabs.replaceWith(table);
}
