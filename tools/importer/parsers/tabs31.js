/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the actual tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tab'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Header row
  const headerRow = ['Tabs (tabs31)'];

  // Build rows for each tab
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab content: use the whole tab panel content
    const panel = tabPanels[i];
    // Defensive: if panel is missing, skip
    if (!panel) return null;

    // Find the main contentfragment/article inside the panel
    const contentFragment = panel.querySelector('article') || panel.querySelector('.contentfragment');
    let tabContent;
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // If not, use the panel itself
      tabContent = panel;
    }
    return [labelText, tabContent];
  }).filter(Boolean);

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(block);
}
