/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and tab panels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row as per block guidelines
  const headerRow = ['Tabs (tabs22)'];

  // Compose rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, idx) => {
    const tabName = label.textContent.trim();
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return null;
    // Find the main content inside the tab panel
    // Use the article if present, else the tabPanel itself
    let content = tabPanel.querySelector('article') || tabPanel;
    // Defensive: If content is empty, return empty string
    if (!content || !content.textContent.trim()) return [tabName, ''];
    return [tabName, content];
  }).filter(Boolean);

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
