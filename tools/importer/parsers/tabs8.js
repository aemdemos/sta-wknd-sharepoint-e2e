/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels
  const tabLabelElements = tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelElements).map(li => li.textContent.trim());

  // Get tab panels in the order of labels. Each panel corresponds to a tab.
  // We rely on the order of .cmp-tabs__tablist > li and .cmp-tabs__tabpanel in DOM being the same.
  const tabPanelElements = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the header row
  const headerRow = ['Tabs (tabs8)'];

  // Compose the tabs row (labels)
  const tabsRow = tabLabels;

  // Compose the content row (tab panel content)
  // For each tabPanel, get its immediate content element (not cloning, referencing original nodes)
  const contentRow = tabPanelElements.map(panel => {
    // The .cmp-contentfragment__elements div contains the main tab content
    // Sometimes there might be intermediary <article> wrappers
    let content = null;
    // Try the most specific content container first:
    content = panel.querySelector('.cmp-contentfragment__elements');
    if (!content) {
      // fallback: use main <article> if present
      content = panel.querySelector('article');
    }
    if (!content) {
      // fallback: use the panel itself
      content = panel;
    }
    // Reference, do not clone
    return content;
  });

  // Build the table cells: header, then the tabs row, then the content row
  const cells = [
    headerRow,
    tabsRow,
    contentRow
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire tabs block with the table
  tabsBlock.replaceWith(table);
}
