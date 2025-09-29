/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (holds tablist and tabpanels)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (content)
  const tabPanels = cmpTabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Build rows: first row is header, then one row per tab
  const headerRow = ['Tabs (tabs21)'];
  const rows = [headerRow];

  // For each tab, add [label, content] row
  tabPanels.forEach((panel, i) => {
    // Defensive: get tab label
    const label = tabLabels[i] || `Tab ${i+1}`;
    // Defensive: get tab content (all children)
    // If the panel contains a contentfragment/article, use that
    let contentElem = null;
    const cf = panel.querySelector('.contentfragment article');
    if (cf) {
      contentElem = cf;
    } else {
      // fallback: use panel itself
      contentElem = panel;
    }
    rows.push([label, contentElem]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
