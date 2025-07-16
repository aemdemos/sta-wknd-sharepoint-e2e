/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs container inside the given block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Block header row EXACTLY as required
  const headerRow = ['Tabs (tabs16)'];

  // Get all tab labels from the tab list
  // Only direct children LI of the tablist
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li')).map(tab => tab.textContent.trim());

  // Get all tab panels in the order they appear
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: handle mismatches
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build an array of tab rows, referencing the main content element per tab
  const tabRows = [];
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Find the deepest main content to represent the tab's content
    // Prefer <article class="cmp-contentfragment"> if present
    let mainContent = panel.querySelector('article.cmp-contentfragment');
    if (!mainContent) {
      // Sometimes there may just be a .contentfragment, or fallback to the tabpanel
      mainContent = panel.querySelector('.contentfragment') || panel;
    }
    tabRows.push([label, mainContent]);
  }

  // Assemble the table: first header, then all tabs
  const cells = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabs.replaceWith(table);
}
