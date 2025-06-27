/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the root tabs block element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 2. Collect the tab labels in order
  const tabLabelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabLabels = tabLabelEls.map((li) => li.textContent.trim());

  // 3. Collect the tab content panels in order, matching labels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Sanity check: same number of panels and labels
  if (tabLabels.length !== tabPanels.length) return;

  // 4. Build the table
  // Header row
  const headerRow = ['Tabs (tabs21)'];
  // Second row: tab labels (one per column)
  const labelsRow = tabLabels;
  // Tab content rows: each row has one cell, corresponding to its tab, and empty for others
  const rows = tabPanels.map((panel, i) => {
    // Remove aria-hidden panels for clean import (they are not visible and may contain duplicate/irrelevant content)
    if (panel.getAttribute('aria-hidden') === 'true') {
      // But for resilience, include them anyway: they might be lazy loaded or reordered
      // Here, we include them as is.
    }
    const row = [];
    tabLabels.forEach((_, j) => {
      if (i === j) {
        // Reference the original panel element
        row.push(panel);
      } else {
        row.push('');
      }
    });
    return row;
  });

  // Compose the final cells array
  const cells = [headerRow, labelsRow, ...rows];

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the tabs block with new table
  tabsRoot.replaceWith(block);
}
