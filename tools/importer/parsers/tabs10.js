/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"]')
  );

  // Build rows: first row is header, then one row per tab
  const rows = [];
  // Always use block name as header row
  const headerRow = ['Tabs (tabs10)'];
  rows.push(headerRow);

  // For each tab, add [label, content] row
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();

    // Defensive: get corresponding tab panel
    const tabPanel = tabPanels[i];
    if (!tabPanel) return;

    // Tab content: use the whole tabPanel's content
    // Defensive: find main contentfragment/article inside panel
    let tabContent = tabPanel.querySelector('.cmp-contentfragment') || tabPanel;

    // Place label and content in row
    rows.push([label, tabContent]);
  });

  // Create table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
