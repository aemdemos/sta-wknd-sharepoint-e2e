/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab headers (li elements inside the tablist)
  const tabHeaders = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if headers and panels match
  if (tabHeaders.length !== tabPanels.length || tabHeaders.length === 0) return;

  // Header row as required
  const rows = [
    ['Tabs (tabs3)']
  ];

  // For each tab, extract label and content
  tabHeaders.forEach((header, i) => {
    // Tab label (textContent)
    const label = header.textContent.trim();
    // Tab content (reference to the actual panel, not a clone)
    const panel = tabPanels[i];
    // Remove aria-hidden from panel if present
    panel.removeAttribute('aria-hidden');
    // Remove tabpanel-specific attributes for cleanliness
    panel.removeAttribute('role');
    panel.removeAttribute('tabindex');
    panel.removeAttribute('data-cmp-hook-tabs');
    panel.removeAttribute('data-cmp-data-layer');
    panel.removeAttribute('id');
    // Add row: [label, content]
    rows.push([
      label,
      panel
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
