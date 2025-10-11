/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Find tab headers (labels)
  const tabHeaders = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Find tab panels (content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only proceed if counts match
  if (tabHeaders.length === 0 || tabHeaders.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab
  const rows = [];
  // Block header row
  rows.push(['Tabs (tabs27)']);

  // For each tab, extract label and content
  for (let i = 0; i < tabHeaders.length; i++) {
    const label = tabHeaders[i].textContent.trim();
    const panel = tabPanels[i];

    // We'll use the entire tab panel content as the cell
    // Remove aria attributes and classes that are not needed
    // (but keep the DOM structure for resilience)
    // Clone the node to avoid moving it out of the DOM
    const panelClone = panel.cloneNode(true);
    // Optionally, clean up tabpanel-specific attributes/classes
    panelClone.removeAttribute('role');
    panelClone.removeAttribute('aria-labelledby');
    panelClone.removeAttribute('tabindex');
    panelClone.removeAttribute('data-cmp-hook-tabs');
    panelClone.classList.remove('cmp-tabs__tabpanel', 'cmp-tabs__tabpanel--active');

    rows.push([label, panelClone]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs container with the table
  tabsContainer.replaceWith(table);
}
