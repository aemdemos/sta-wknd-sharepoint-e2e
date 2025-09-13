/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows: header, then one row per tab
  const rows = [];
  // Always use the required header
  rows.push(['Tabs (tabs23)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // For tab content, grab the main contentfragment/article inside the panel
    // (this is the main content for each tab)
    let tabContent = null;
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // fallback: use the panel itself
      tabContent = panel;
    }

    // Always reference the existing element, not clone or create new
    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
