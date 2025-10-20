/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) cmpTabs = tabsContainer;
  if (!cmpTabs) return;

  // Get tab titles
  const tabTitles = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: If mismatch, bail
  if (tabTitles.length === 0 || tabPanels.length === 0 || tabTitles.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs34)'];
  const rows = [headerRow];

  // Build rows for each tab
  tabTitles.forEach((tabTitleEl, idx) => {
    // Tab label (use textContent)
    const tabLabel = tabTitleEl.textContent.trim();

    // Tab content: find the corresponding tabpanel
    const panel = tabPanels[idx];
    // Defensive: If not found, skip
    if (!panel) return;

    // For robustness, grab all direct children of the tabpanel
    // If there's a single contentfragment/article, use that
    let tabContent;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Otherwise, use all children
      const children = Array.from(panel.children).filter(e => e.nodeType === 1);
      tabContent = children.length === 1 ? children[0] : children;
    }

    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
