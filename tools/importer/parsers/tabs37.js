/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row: must match block name exactly
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab panel content
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;

    // Only include meaningful children (skip empty grid wrappers)
    let tabContent = [];
    Array.from(tabPanel.children).forEach(child => {
      if (child.classList.contains('aem-Grid') && child.children.length === 0) return;
      tabContent.push(child);
    });
    // If only one element, just use it
    if (tabContent.length === 1) tabContent = tabContent[0];
    // If no children, fallback to textContent
    if (tabContent.length === 0) tabContent = tabPanel.textContent.trim();

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block table
  tabsBlock.replaceWith(block);
}
