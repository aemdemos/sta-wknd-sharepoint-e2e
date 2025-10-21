/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs;
  if (tabsContainer && tabsContainer.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer;
  } else if (tabsContainer) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  } else {
    cmpTabs = element.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    // Try to filter only panels with role="tabpanel"
    const filteredPanels = tabPanels.filter(panel => panel.getAttribute('role') === 'tabpanel');
    if (tabLabels.length === filteredPanels.length) {
      tabPanels.length = 0;
      tabPanels.push(...filteredPanels);
    }
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs10)']);

  // For each tab, extract label and content
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    // Defensive: find the main content fragment/article inside panel
    let tabContent = null;
    // Prefer contentfragment/article, fallback to panel itself
    tabContent = panel.querySelector('.contentfragment, article');
    if (!tabContent) {
      // fallback: use all children
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => tabContent.appendChild(node.cloneNode(true)));
    }
    rows.push([label, tabContent]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
