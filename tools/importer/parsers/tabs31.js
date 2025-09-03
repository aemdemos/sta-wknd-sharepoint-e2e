/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Always use the required header row
  const headerRow = ['Tabs (tabs31)'];

  // Get all tab labels and tab panels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process if counts match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel, idx) => {
    const labelText = tabLabel.textContent.trim();
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return null;
    // Find the main content fragment/article inside the tab panel
    let tabContent = tabPanel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (!tabContent) tabContent = tabPanel;
    return [labelText, tabContent];
  }).filter(Boolean);

  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
