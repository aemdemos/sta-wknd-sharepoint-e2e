/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels
  const tabList = tabsRoot.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll(':scope > li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels in order
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll(':scope > .cmp-tabs__tabpanel')
  );

  // Fallback: If not direct children, get all matching tabpanels inside
  if (tabPanels.length < tabLabels.length) {
    const allTabPanels = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');
    if (allTabPanels.length >= tabLabels.length) {
      tabPanels.length = 0;
      allTabPanels.forEach(panel => tabPanels.push(panel));
    }
  }

  // Build tab rows: [label, content element]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (label && panel) {
      rows.push([label, panel]);
    }
  }

  // Only continue if we have at least one tab
  if (rows.length === 0) return;

  // Header row, matching the example exactly
  const headerRow = ['Tabs (tabs19)'];

  // Final table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block only (not the entire source element)
  tabsRoot.replaceWith(table);
}
