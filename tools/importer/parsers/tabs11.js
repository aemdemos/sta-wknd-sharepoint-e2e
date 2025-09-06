/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Block header row as required
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];

  // Find the tabs container
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only add as many panels as there are labels
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const panelEl = tabPanels[i];
    if (!labelEl || !panelEl) continue;

    // Tab label: use the textContent of the li
    const tabLabel = labelEl.textContent.trim();

    // Tab content: use all direct children of the tabpanel
    const tabContent = Array.from(panelEl.children);
    // If only one child, use it directly
    rows.push([tabLabel, tabContent.length === 1 ? tabContent[0] : tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  if (block && block !== element) {
    element.replaceWith(block);
  }
}
