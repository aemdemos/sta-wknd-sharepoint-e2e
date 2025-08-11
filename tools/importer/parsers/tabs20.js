/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cmp-tabs block within the given element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Collect tab labels (from the top tab list)
  const tabLabelEls = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li'));

  // Collect tab panel contents in the order they appear
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure matching count
  const nTabs = Math.min(tabLabelEls.length, tabPanels.length);

  // Build header row as shown in the example
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // Each following row is: [Tab Label, Tab Content]
  for (let i = 0; i < nTabs; i++) {
    // Tab label as text
    const tabLabel = tabLabelEls[i].textContent.trim();

    // Tab content: The tab panel (reference the live element)
    const tabContent = tabPanels[i];

    rows.push([tabLabel, tabContent]);
  }

  // Create the tabs block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the new table block
  tabsEl.replaceWith(block);
}
