/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels and their associated tabpanel IDs
  const tablist = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  const tabPanelIds = [];
  if (tablist) {
    tablist.querySelectorAll('li').forEach((li) => {
      tabLabels.push(li.textContent.trim());
      const controls = li.getAttribute('aria-controls');
      if (controls) {
        tabPanelIds.push(controls);
      } else {
        tabPanelIds.push(null);
      }
    });
  }

  // For each tab, find the corresponding panel element by ID
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let content = null;
    if (tabPanelIds[i]) {
      content = tabsRoot.querySelector(`#${tabPanelIds[i]}`);
    }
    // Fallback: if panel not found, try by order
    if (!content) {
      const allPanels = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');
      content = allPanels[i] || document.createElement('div');
    }
    rows.push([label, content]);
  }

  // Prepare the table with header row
  const cells = [
    ['Tabs (tabs34)'],
    ...rows
  ];

  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}