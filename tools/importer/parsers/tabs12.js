/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabs.querySelectorAll(':scope > ol.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabs.querySelectorAll(':scope > div[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: If the number of labels and panels don't match, bail
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build the block header row
  const headerRow = ['Tabs (tabs12)'];

  // Build the tab label row: Each tab label in a <strong> element per cell
  const tabLabelRow = tabLabels.map(label => {
    const strong = document.createElement('strong');
    strong.textContent = label.textContent.trim();
    return strong;
  });

  // Now, for each tab, create a row with one cell (the content) in the correct column, rest empty
  const contentRows = tabPanels.map((panel, colIdx) => {
    // Reference the main content fragment or article, or all panel children
    let mainContent = panel.querySelector(':scope > .contentfragment, :scope > article');
    let content = mainContent || Array.from(panel.childNodes).filter(
      n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
    );
    // Build the row: for each column, only the correct column gets content
    return tabLabels.map((_, i) => (i === colIdx ? content : ''));
  });

  // Compose the table (header row, tab label row, then one content row per tab)
  const table = [headerRow, tabLabelRow, ...contentRows];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(table, document);

  // Replace the original tabs block with the new block table
  tabs.replaceWith(block);
}
