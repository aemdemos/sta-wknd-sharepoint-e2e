/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (the actual tab container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only process if we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build rows: header row, then one row per tab
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, create [label, content] row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // Extract the main content fragment/article inside each panel
    // We'll use the entire article as the tab content for resilience
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel;

    // If there is an image inside the content fragment, include it
    // If there is a paragraph or list, include it
    // We'll reference the whole content fragment for the cell
    rows.push([
      label,
      contentFragment
    ]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the block table
  tabsBlock.replaceWith(block);
}
