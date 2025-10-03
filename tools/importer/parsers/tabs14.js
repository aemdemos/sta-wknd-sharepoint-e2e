/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element inside the tabs container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels (li elements in the tablist)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as required
  const headerRow = ['Tabs (tabs14)'];
  rows.push(headerRow);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label text
    const label = tabLabels[i].textContent.trim();

    // Tab panel content: we want the visible content only
    const panel = tabPanels[i];
    // We'll use the entire contentfragment/article inside the tabpanel as the content cell
    let content = null;
    // Try to find the main content fragment/article inside the tabpanel
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // fallback: use the panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs container with the table
  tabsContainer.replaceWith(table);
}
