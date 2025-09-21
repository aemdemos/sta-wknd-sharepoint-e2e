/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels (li elements inside ol.cmp-tabs__tablist)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure tabLabels and tabPanels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build the header row
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, idx) => {
    // Get the label text
    const label = tabLabel.textContent.trim();
    // Get the corresponding panel
    const panel = tabPanels[idx];
    // Defensive: skip if missing
    if (!panel) return;

    // Find the main contentfragment/article inside the panel
    const cf = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (cf) {
      // Use the entire contentfragment as tab content
      tabContent = cf;
    } else {
      // Fallback: use the panel's content
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the table
  tabsContainer.replaceWith(table);
}
