/* global WebImporter */
export default function parse(element, { document }) {
  // Find the specific .tabs block containing the cmp-tabs
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Collect tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Collect tab content panels in order
  const tabPanels = cmpTabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Start with the header row per requirements
  const cells = [["Tabs (tabs14)"]];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    // Each panel usually contains a .cmp-contentfragment, but we want all meaningful content
    // Collect all non-empty child nodes except for grid placeholders
    const contentElements = [];
    Array.from(panel.children).forEach(child => {
      // Skip meaningless grid blocks
      if (child.classList && Array.from(child.classList).some(cls => cls.startsWith('aem-Grid'))) {
        if (!child.textContent.trim()) return;
      }
      // Only push if not empty
      if (child.textContent.trim() || child.querySelector('img,ul,ol')) {
        contentElements.push(child);
      }
    });
    // If empty, fallback to the whole panel
    let content;
    if (contentElements.length === 0) {
      content = panel;
    } else if (contentElements.length === 1) {
      content = contentElements[0];
    } else {
      content = contentElements;
    }
    cells.push([label, content]);
  });

  // Create block table and replace the tabs block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsContainer.replaceWith(block);
}
