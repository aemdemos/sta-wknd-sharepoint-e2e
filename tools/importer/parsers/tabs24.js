/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // For each tab, get label and content
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: Find corresponding tab panel
    const panel = tabPanels[i];
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: reference the main contentfragment/article inside the panel
    let tabContent = null;
    tabContent = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;

    // Place label and content in a row
    rows.push([labelText, tabContent]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original tabs block with the table
  tabsBlock.replaceWith(table);
}
