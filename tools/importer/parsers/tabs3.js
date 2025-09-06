/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs3)'];

  // Build rows: [label, content]
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab content: reference the entire tabpanel element
    const tabPanel = tabPanels[i];
    // Defensive: If tabPanel contains a single contentfragment, use its content
    let tabContent;
    const contentFragment = tabPanel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Otherwise, use the tabPanel itself
      tabContent = tabPanel;
    }
    return [labelText, tabContent];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
