/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block in the element
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Header row for the block table
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process if we have the same number of tabs and panels
  if (tabLabels.length !== tabPanels.length) return;

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content (reference the whole panel)
    const panel = tabPanels[idx];
    // Defensive: Find the main contentfragment inside the panel
    const contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    // Use contentFragment if present, else fallback to panel
    const tabContent = contentFragment || panel;
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new block table
  tabs.replaceWith(block);
}
