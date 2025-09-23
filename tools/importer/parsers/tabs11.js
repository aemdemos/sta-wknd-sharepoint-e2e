/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs11)'];

  // Find tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only process if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build rows for each tab
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab content: use the entire tabPanel content
    const tabPanel = tabPanels[i];
    // Defensive: get the main content fragment/article inside the tabPanel
    let tabContent = tabPanel.querySelector('article') || tabPanel;
    return [labelText, tabContent];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs block with the new table
  tabsBlock.replaceWith(table);
}
