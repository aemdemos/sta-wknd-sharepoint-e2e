/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs block within the given element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = tabList.querySelectorAll('li');

  // Extract tab panels (by role="tabpanel" in the right order)
  const tabPanelEls = tabsBlock.querySelectorAll('[role="tabpanel"]');

  // The header row as per the requirements
  const headerRow = ['Tabs (tabs6)'];
  const rows = [headerRow];

  // Defensive: Only process as many tab panels as we have labels (or vice versa)
  const numTabs = Math.min(tabLabelEls.length, tabPanelEls.length);
  for (let i = 0; i < numTabs; i++) {
    // Tab label: always from the tablist li element
    const label = tabLabelEls[i]?.textContent.trim() || '';
    // Tab content: reference the contentfragment/article if present, else the whole panel
    const panel = tabPanelEls[i];
    let tabContent = null;
    // Prefer contentfragment/article inside panel
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback: entire tabpanel
      tabContent = panel;
    }
    // Each row: [Tab Label, Tab Content Element]
    rows.push([label, tabContent]);
  }

  // Build and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
