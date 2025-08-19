/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cmp-tabs block within the supplied element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Gather tab labels (from .cmp-tabs__tablist > li)
  const tabLabelsEls = tabsBlock.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelsEls).map(li => li.textContent.trim());

  // Gather tab panels (by data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Ensure we have the same number of tabs and panels, else fallback gracefully
  if (tabLabels.length !== tabPanels.length) {
    // Try to trim to the shortest length
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Build header row (EXACT case from the example)
  const headerRow = ['Tabs (tabs13)'];

  // Second row is the tab labels as columns
  const tabsRow = tabLabels;

  // Content rows: each contains the tab content in the same column as its tab label, with empty cells elsewhere
  const contentRows = tabPanels.map((panel, idx) => {
    // Each tab panel should output its main content fragment/article, or the full panel if not present
    const article = panel.querySelector('article');
    // All cells are empty except this index
    const row = tabLabels.map((_, i) => {
      if (i === idx) {
        return article ? article : panel;
      } else {
        return '';
      }
    });
    return row;
  });

  // Assemble the table
  const cells = [
    headerRow,
    tabsRow,
    ...contentRows
  ];

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
