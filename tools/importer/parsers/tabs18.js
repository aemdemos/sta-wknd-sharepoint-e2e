/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (should be <li> inside the <ol> tablist)
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li'));

  // Get the tab panels (role="tabpanel")
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build rows for the block table
  const rows = [];
  // Header row with block name exactly as required
  rows.push(['Tabs (tabs18)']);

  // For each tab, find the corresponding panel by aria-labelledby and add to rows
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const labelId = tabLabels[i].id;
    // Find matching panel for this tab label
    const panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === labelId);
    if (panel) {
      // For the content cell, reference the main content node inside the tab panel
      // Usually a single <article> or .contentfragment or similar. Fallback to panel itself
      let contentElement = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
      rows.push([label, contentElement]);
    } else {
      // If panel is missing, push empty cell to preserve tab structure
      rows.push([label, '']);
    }
  }

  // Create table and replace the tabs block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(block);
}
