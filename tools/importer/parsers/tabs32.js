/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get all tab panels in order
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build header row as in the example
  const headerRow = ['Tabs (tabs32)'];
  const rows = [headerRow];

  // Each subsequent row: label (bold) in first cell, content in second cell
  for (let i = 0; i < tabLabels.length; i++) {
    // First column: bold tab label
    const labelElem = document.createElement('strong');
    labelElem.textContent = tabLabels[i];

    // Second column: tab content
    let tabContentElem = tabPanels[i];
    let contentCell = '';
    if (tabContentElem) {
      // Use the inner .contentfragment > article if present, else the whole tabpanel
      const contentFragment = tabContentElem.querySelector('article') || tabContentElem.querySelector('.contentfragment');
      if (contentFragment) {
        contentCell = contentFragment;
      } else {
        // fallback: use the whole tabPanel
        contentCell = tabContentElem;
      }
    }
    rows.push([labelElem, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace tabsRoot in the DOM with the new block table
  tabsRoot.replaceWith(block);
}
