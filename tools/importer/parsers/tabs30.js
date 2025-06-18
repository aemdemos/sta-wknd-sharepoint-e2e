/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: look for a .cmp-tabs inside this element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels in order
  const tabLabelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());
  
  // Extract tab panels in order
  const panelNodes = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process if lengths match
  if (tabLabels.length !== panelNodes.length) return;

  // Build the table as in the example
  const cells = [];
  // Header row, per spec: block/component name and variant
  cells.push(['Tabs (tabs30)']);
  // Each tab: first cell is label, second cell is existing tab panel content
  for (let i = 0; i < tabLabels.length; i++) {
    // Reference the actual tab panel element (not cloning)
    cells.push([tabLabels[i], panelNodes[i]]);
  }
  
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsRoot with the table
  tabsRoot.replaceWith(table);
}
