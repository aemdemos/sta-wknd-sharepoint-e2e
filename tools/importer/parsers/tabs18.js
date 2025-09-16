/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Only proceed if we have labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Table header must match target block name exactly
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, i) => {
    // Defensive: Some tabs may have no corresponding panel
    const panel = tabPanels[i];
    let contentEl = '';
    if (panel) {
      // Use the existing tabpanel element as the content cell
      contentEl = panel;
    }
    rows.push([label, contentEl]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
