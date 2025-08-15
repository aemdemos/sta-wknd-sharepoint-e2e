/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in correct order
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // For each tab label, get the corresponding tab panel by aria-controls
  const rows = tabLabels.map((tabLabel) => {
    const labelText = tabLabel.textContent.trim();
    const panelId = tabLabel.getAttribute('aria-controls');
    const tabPanel = panelId ? tabsBlock.querySelector(`#${panelId}`) : null;
    let tabContent = null;

    // Try to get the main content fragment/article inside the tab panel
    if (tabPanel) {
      tabContent = tabPanel.querySelector('article.cmp-contentfragment') || tabPanel;
    } else {
      // Defensive fallback if not found
      tabContent = document.createTextNode('');
    }

    return [labelText, tabContent];
  });

  // Compose the table: header row, then tab rows
  const headerRow = ['Tabs (tabs8)'];
  const tableArray = [headerRow, ...rows];

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(table);
}
