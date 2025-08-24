/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (.cmp-tabs) inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (from the tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabItems = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);

  // Get all tab panels, in order as presented in HTML
  const panelNodes = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row: block name as in the example
  const headerRow = ['Tabs (tabs38)'];

  // Compose tab label row: each label as a string (or wrapped in span for resiliency)
  const tabLabelRow = tabItems.map(tab => {
    // Use only direct text, trimmed
    return tab.textContent.trim();
  });

  // Compose a content row for each tab (one row per tab, second column is tab content)
  const rows = panelNodes.map((panel, i) => {
    // Tab label (first column)
    const tabLabel = tabLabelRow[i] || '';
    // Find the main content fragment/article inside this tab panel
    // Use all direct children except possible grids/divs used for layout only
    let contentElem = null;
    // Prefer contentfragment/article if present
    const contentFragment = panel.querySelector('.contentfragment') || panel.querySelector('article');
    if (contentFragment) {
      contentElem = contentFragment;
    } else {
      // Otherwise grab everything inside the panel
      // Make a div container
      const div = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim() !== '')) {
          div.appendChild(node);
        }
      });
      contentElem = div;
    }
    // Only include content if not empty
    return [tabLabel, contentElem];
  });

  // Build table data: header row, then each tab row
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabsBlock element with the table
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
