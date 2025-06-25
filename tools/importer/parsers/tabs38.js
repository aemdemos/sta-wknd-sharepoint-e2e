/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels in order
  const tablist = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row: block name (exact)
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each tab, get label and panel content (use referenced elements only)
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    let panelContent = '';
    if (panel) {
      // Try to reference the first contentfragment/article inside the panel
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        panelContent = contentFragment;
      } else {
        // Otherwise, use everything inside the panel as a wrapper
        // If panel has one main child, use that
        if (panel.children.length === 1) {
          panelContent = panel.firstElementChild;
        } else if (panel.children.length > 1) {
          // Use panel itself (references everything inside)
          panelContent = panel;
        } else {
          // panel empty
          panelContent = '';
        }
      }
    }
    rows.push([label, panelContent]);
  });

  // Create table and replace tabs block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsRoot.replaceWith(block);
}
