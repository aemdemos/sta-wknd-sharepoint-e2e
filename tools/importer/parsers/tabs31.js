/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Find tab labels
  const tabLabels = [];
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Find corresponding tab panels (contents)
  // Only include panels that have a corresponding label
  const tabPanels = [];
  // Get an array of all tabpanel elements in DOM order
  const panelsNodeList = tabs.querySelectorAll('div[role="tabpanel"]');
  // For each panel, capture direct child relevant content
  panelsNodeList.forEach(panel => {
    // Prefer .contentfragment child if present, else fallback to panel itself
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      tabPanels.push(cf);
    } else {
      tabPanels.push(panel);
    }
  });

  // Prepare table rows: header, then [tab label, tab content] for each tab
  // Table header must exactly match the specification
  const rows = [];
  rows.push(["Tabs (tabs31)"]); // header row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Defensive: ensure only as many panels as labels
    const content = tabPanels[i] || document.createElement('div');
    rows.push([label, content]);
  }

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
