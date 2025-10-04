/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const tabsComponent = tabsBlock.querySelector('.cmp-tabs');
  if (!tabsComponent) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsComponent.querySelectorAll('.cmp-tabs__tablist > li')
  ).map((li) => li.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsComponent.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Header row: always use block name
  const headerRow = ['Tabs (tabs24)'];

  // Build rows for each tab
  const rows = tabLabels.map((label, idx) => {
    // Tab label cell
    const labelCell = label;

    // Tab content cell: get all direct children of the tabpanel
    const tabPanel = tabPanels[idx];
    // Defensive: If tabPanel is missing, skip
    if (!tabPanel) return null;

    // For robustness, collect all direct children of tabPanel
    const contentElements = Array.from(tabPanel.children);
    // If no children, fallback to innerHTML as a paragraph
    let contentCell;
    if (contentElements.length === 0) {
      const p = document.createElement('p');
      p.innerHTML = tabPanel.innerHTML;
      contentCell = p;
    } else {
      contentCell = contentElements;
    }

    return [labelCell, contentCell];
  }).filter(Boolean);

  // Compose the table cells array
  const cells = [headerRow, ...rows];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
