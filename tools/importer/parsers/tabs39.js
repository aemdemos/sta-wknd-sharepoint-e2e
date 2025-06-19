/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab content panels (in order)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // For each tab, get the main content referenced from the panel (see prior guidance)
  const rows = [];
  // Header row as specified, exactly
  rows.push(['Tabs (tabs39)']);
  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let mainContent = Array.from(panel.children).find(child => {
      if (child.classList.contains('contentfragment')) return true;
      if (child.tagName === 'ARTICLE') return true;
      // Accept divs that contain elements
      if (child.children.length > 0) return true;
      // Accept divs or elements that have text
      if (child.textContent.trim()) return true;
      return false;
    });
    if (!mainContent) {
      // fallback: all children
      mainContent = Array.from(panel.children);
    }
    rows.push([label, mainContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsContainer.replaceWith(table);
}
