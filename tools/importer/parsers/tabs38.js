/* global WebImporter */
export default function parse(element, { document }) {
  // Look for the .cmp-tabs (the tabs block)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the tablist
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tabpanel elements (order should match tabLabels)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Edge case: check counts match
  if (tabLabels.length !== tabPanels.length) {
    // If there's a mismatch, abort to avoid corrupt table output
    return;
  }

  // Build array of tab content. For each panel, reference the existing contentfragment article,
  // or fallback to the panel itself if not present.
  const tabContents = tabPanels.map(panel => {
    const article = panel.querySelector('article');
    return article ? article : panel;
  });

  // Compose the cells array as per block requirements and example:
  // - First row: ["Tabs (tabs38)"]
  // - Second row: all tab labels (columns)
  // - Third row: all tab contents (columns)
  const headerRow = ['Tabs (tabs38)'];
  const labelsRow = tabLabels;
  const contentsRow = tabContents;

  const cells = [headerRow, labelsRow, contentsRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs element with the new block table
  tabs.parentNode.replaceChild(table, tabs);
}
