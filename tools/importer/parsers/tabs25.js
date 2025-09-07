/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('div[role="tabpanel"]')
  );

  // Defensive: ensure we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Table header row as required
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: get corresponding panel
    const panel = tabPanels[i];
    if (!panel) continue;

    // For content, grab the main contentfragment/article inside the panel
    // (this is the detailed content for the tab)
    let content = null;
    // Try to find the contentfragment/article
    content = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    // If not found, fallback to the panel itself
    if (!content) content = panel;

    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
