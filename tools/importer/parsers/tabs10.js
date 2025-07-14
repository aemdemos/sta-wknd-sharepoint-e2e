/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block within the given element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels from the tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract tab content panels
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the table header as specified
  const cells = [];
  cells.push(['Tabs (tabs10)']);

  // Create a row for each tab: [label, content]
  for (let i = 0; i < Math.max(tabLabels.length, tabPanels.length); i++) {
    const label = tabLabels[i] || '';
    const panel = tabPanels[i] || null;
    // For tab content, reference all children of the tabpanel
    let tabContent;
    if (panel) {
      if (panel.children.length === 1) {
        tabContent = panel.firstElementChild;
      } else if (panel.children.length > 1) {
        // If multiple direct children, put them all in an array for the cell
        tabContent = Array.from(panel.children);
      } else {
        // Fallback: if empty, pass an empty string
        tabContent = '';
      }
    } else {
      tabContent = '';
    }
    cells.push([label, tabContent]);
  }

  // Construct the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs container with the new table
  tabsContainer.replaceWith(table);
}
