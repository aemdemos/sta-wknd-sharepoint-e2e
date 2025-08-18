/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (.tabs)
  const tabsRoot = element.querySelector('.tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs inside it
  const tabsCmp = tabsRoot.querySelector('.cmp-tabs');
  if (!tabsCmp) return;

  // Get all tab labels from tablist
  const tablist = tabsCmp.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;

  const tabLabels = Array.from(tablist.querySelectorAll('li'));
  // Get all tab panels in render order
  const tabPanels = Array.from(tabsCmp.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header exactly as specified
  const headerRow = ['Tabs (tabs24)'];
  const cells = [headerRow];

  // Each row: [Tab Label, Tab Panel Content]
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    // Use label's text as in the tab
    const labelText = tabLabels[i].textContent.trim();
    // Use the whole panel element (existing reference)
    cells.push([labelText, tabPanels[i]]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(block);
}
