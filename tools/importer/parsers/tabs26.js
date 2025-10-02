/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs inside the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Find the tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Find all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Ensure the number of labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row as required by block spec
  const headerRow = ['Tabs (tabs26)'];

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab content: use the entire tabPanel's content
    const panel = tabPanels[i];
    // Only grab the actual content inside the tabPanel
    // We'll use all children of the tabPanel (not the tabPanel itself)
    const contentNodes = Array.from(panel.childNodes).filter(n => {
      // Filter out empty text nodes
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      return true;
    });
    // If only one node, use that node directly; otherwise, use array
    return [labelText, contentNodes.length === 1 ? contentNodes[0] : contentNodes];
  });

  // Compose final table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
