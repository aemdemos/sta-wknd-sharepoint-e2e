/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block in the given element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Build rows: header first
  const headerRow = ['Tabs (tabs3)'];
  const rows = [headerRow];

  // For each tab, get label and corresponding content
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: match tabpanel by aria-controls or order
    let panel = tabPanels.find(
      p => p.getAttribute('aria-labelledby') === tabLabel.id
    );
    if (!panel) {
      panel = tabPanels[i];
    }
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab content: use the entire tabpanel div
    rows.push([labelText, panel]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
