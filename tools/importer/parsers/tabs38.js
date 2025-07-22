/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tablist and tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabLis.map(li => li.textContent.trim());

  // Get the tabpanels (tab contents)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Ensure the number of panels matches labels for a correct table structure
  if (tabPanels.length !== tabLabels.length) {
    // fallback: try to match by aria-labelledby
    // or ignore tabs with mismatches
    return;
  }

  // Header row: block name and tab labels
  const headerRow = ['Tabs (tabs38)', ...tabLabels];

  // Content row: empty first cell, then tab contents
  const contentRow = [''];
  tabPanels.forEach((panel) => {
    // Prefer the <article> if present as the main tab content
    const article = panel.querySelector('article');
    if (article) {
      contentRow.push(article);
    } else {
      // If no article, gather all direct children in a wrapper
      const tempDiv = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => tempDiv.appendChild(node));
      contentRow.push(tempDiv);
    }
  });

  // Build the table
  const tableCells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the tabs block with the table
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
