/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the given element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Tabs (tabs37)'];
  rows.push(headerRow);

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: Find corresponding panel
    const panel = tabPanels[i];
    if (!panel) return;

    // Get the tab label text
    const labelText = tabLabel.textContent.trim();
    // Get the tab content (use the entire panel's content)
    // Defensive: If panel has a contentfragment, use that
    let contentElem = panel.querySelector('.contentfragment, article.cmp-contentfragment') || panel;

    rows.push([labelText, contentElem]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
