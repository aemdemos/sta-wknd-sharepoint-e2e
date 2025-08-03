/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block in the given element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements inside the tablist)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tabpanel elements (each tab's content)
  // Only consider panels that are direct children of .cmp-tabs
  const tabPanels = tabLabels.map((_, i) => {
    // Each tabpanel has an id like tabs-...-item-...-tabpanel
    // Tab labels are in order so panels should be as well
    // Find all panels in .cmp-tabs, not globally
    return tabsContainer.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')[i] || null;
  });

  // Build the rows: first row is the block header, then one row per tab (label, content)
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs33)']);
  // One row for each tab (label, content)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Reference the entire content of the tabpanel as the content cell
    // If there's only one child (as expected), use it; else, wrap children into a div
    let tabContent;
    if (panel.children.length === 1) {
      tabContent = panel.children[0];
    } else {
      const wrapper = document.createElement('div');
      Array.from(panel.childNodes).forEach(n => wrapper.appendChild(n));
      tabContent = wrapper;
    }
    rows.push([label, tabContent]);
  }

  // Create new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs container with the new block table
  tabsContainer.replaceWith(table);
}
