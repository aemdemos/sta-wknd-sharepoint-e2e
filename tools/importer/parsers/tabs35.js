/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the main tabs block)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels from the tablist (ol > li)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get the tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: If labels and panels don't match, abort
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per requirements
  rows.push(['Tabs (tabs35)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: find the main content fragment/article inside the tab panel
    let content = null;
    // Try to find the .cmp-contentfragment or article
    content = panel.querySelector('.cmp-contentfragment') || panel.querySelector('article') || panel;

    // Place the content element directly (do not clone)
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsRoot with the block table
  tabsRoot.replaceWith(block);
}
