/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tab')).map((tab) => tab.textContent.trim());

  // Get tab panels (the content for each tab, in same order)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose rows for the table: first is header, second is tab labels, third is tab content
  const headerRow = ['Tabs (tabs12)']; // exactly as example

  // The tab labels row: each label in a column
  const labelsRow = tabLabels;

  // The tab content row: each cell is the main content for each tab
  const contentRow = tabPanels.map(panel => {
    // Prefer the article or its main contentfragment child
    let contentElem = panel.querySelector('article, .contentfragment');
    if (!contentElem) {
      // else use the panel itself
      contentElem = panel;
    }
    return contentElem;
  });

  // Compose the table rows as a 2D cells array
  const cells = [headerRow, labelsRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace only the tabs block with the block table
  tabs.replaceWith(block);
}
