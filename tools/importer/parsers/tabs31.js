/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from tablist (ol > li)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // For each tab label, get the corresponding tabpanel
  // Tabpanel id is in the aria-controls of the tab
  const tabRows = tabLabels.map(tabEl => {
    const label = tabEl.textContent.trim();
    const panelId = tabEl.getAttribute('aria-controls');
    const tabPanel = tabsBlock.querySelector(`#${panelId}`);
    if (!tabPanel) return null;
    // For content: reference the main content within the tabPanel
    // We want the core content: typically a single .contentfragment inside each tabPanel
    // We reference the direct child (usually .contentfragment),
    // but fallback to tabPanel if not found
    const content = tabPanel.querySelector('.contentfragment') || tabPanel;
    return [label, content];
  }).filter(Boolean);

  // Compose the table cells array
  const cells = [
    ['Tabs (tabs31)'],
    ...tabRows
  ];

  // Create table and replace original tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
