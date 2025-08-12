/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Get all tab labels and tab content panels in order
  const tabLabels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('[role="tabpanel"]'));

  if (!tabLabels.length || !tabPanels.length) return;

  // Build the header row: single column
  const headerRow = ['Tabs (tabs23)'];

  // Each tab gets its own row: [label, content]
  const rows = tabLabels.map((tab, i) => {
    // For the label column, use only the label text as a <span>
    const labelSpan = document.createElement('span');
    labelSpan.textContent = tab.textContent.trim();
    // For the content column, use the main .contentfragment if present, else full panel
    const panel = tabPanels[i];
    let content = panel.querySelector('.contentfragment');
    if (!content) content = panel;
    return [labelSpan, content];
  });

  // Compose the table cells
  const cells = [headerRow, ...rows];

  // Create the table and replace the block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsWrapper.replaceWith(table);
}
