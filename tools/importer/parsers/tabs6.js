/* global WebImporter */
export default function parse(element, { document }) {
  // Only process tab blocks
  if (!element.classList.contains('tabs') && !element.classList.contains('panelcontainer')) return;

  // Find the tabs container (should be a cmp-tabs)
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row
  const headerRow = ['Tabs (tabs6)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    const panel = tabPanels[i];
    if (!panel) return;

    // Tab label text
    const label = tabLabel.textContent.trim();

    // Tab content: grab the entire tabpanel content as HTML string
    // This ensures the table cell is never empty
    const contentHTML = panel.innerHTML.trim();
    // Create a wrapper div and set its HTML
    const wrapper = document.createElement('div');
    wrapper.innerHTML = contentHTML;

    rows.push([label, [wrapper]]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
