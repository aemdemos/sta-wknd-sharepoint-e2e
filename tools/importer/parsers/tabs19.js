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

  // Get tab panels and their content
  const tabPanels = [];
  tabsRoot.querySelectorAll('.cmp-tabs__tabpanel').forEach(panel => {
    // Defensive: skip empty panels
    if (!panel || !panel.hasChildNodes()) {
      tabPanels.push(document.createElement('div'));
      return;
    }
    // For resilience, wrap the content in a div and append all children
    const panelDiv = document.createElement('div');
    // Copy all children (preserves images, structure, etc)
    Array.from(panel.childNodes).forEach(child => {
      panelDiv.appendChild(child);
    });
    tabPanels.push(panelDiv);
  });

  // Build the table rows
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    rows.push([
      tabLabels[i],
      tabPanels[i] || document.createElement('div'),
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  element.replaceWith(table);
}
