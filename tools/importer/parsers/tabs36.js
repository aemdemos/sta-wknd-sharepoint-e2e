/* global WebImporter */
export default function parse(element, { document }) {
  // Select the cmp-tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('ol.cmp-tabs__tablist > li'));
  // Get tab panels (content associated with each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Table header: block name as specified in the example
  const headerRow = ['Tabs (tabs36)'];

  // First content row: Tab labels, preserving order
  const tabLabelCells = tabLabels.map(label => {
    // Use <strong> only for visually active tab, but all in example are bold, so use strong for all
    // Reference the actual text node for the tab label
    const strong = document.createElement('strong');
    strong.textContent = label.textContent.trim();
    return strong;
  });

  // Second content row: Tab contents, matching tab labels order
  const tabContentCells = tabPanels.map(panel => {
    // Reference the main content block for each tab (contentfragment/article)
    // If contentfragment is present, use its article, otherwise the panel itself
    const article = panel.querySelector('article');
    if (article) return article;
    // fallback: use the whole panel if no article found
    return panel;
  });

  // Compose the table
  const cells = [
    headerRow,
    tabLabelCells,
    tabContentCells
  ];

  // Create the table and replace the tabs block
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
