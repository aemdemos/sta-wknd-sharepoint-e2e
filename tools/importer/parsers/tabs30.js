/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab
  const rows = [];
  // Always use the required block name as header
  rows.push(['Tabs (tabs30)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // For tab content, grab the entire contentfragment/article inside the panel
    let tabContent = null;
    // Try to find the main content fragment/article
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use the panel itself
      tabContent = panel;
    }

    rows.push([
      label,
      tabContent
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the table
  tabs.replaceWith(table);
}
