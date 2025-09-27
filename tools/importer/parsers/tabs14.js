/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
    tabLabels.push(tab.textContent.trim());
  });

  // Get tab panels (content)
  const tabPanels = [];
  tabsRoot.querySelectorAll('.cmp-tabs__tabpanel').forEach(panel => {
    // Defensive: find the main contentfragment/article inside each tabpanel
    let content = null;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      // Use the whole contentfragment as the tab content
      content = cf;
    } else {
      // If not found, fallback to the panel itself
      content = panel;
    }
    tabPanels.push(content);
  });

  // Compose rows: header, then one row per tab (label, content)
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: if panels and labels mismatch, skip
    if (!tabPanels[i]) continue;
    rows.push([
      tabLabels[i],
      tabPanels[i]
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block root with the table
  tabsRoot.replaceWith(table);
}
