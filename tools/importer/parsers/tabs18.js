/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab headers (<li> in <ol>)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabEls = Array.from(tabList.querySelectorAll('li'));

  // Get the tabpanels by role and data-cmp-hook-tabs
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Map: panel id -> panel element
  const panelMap = {};
  tabPanels.forEach(panel => {
    const id = panel.getAttribute('id');
    if (id) {
      panelMap[id] = panel;
    }
  });

  // Build the table header
  const headerRow = ['Tabs (tabs18)'];
  const cells = [headerRow];

  // For each tab, build a row [Tab Label, Tab Content]
  tabEls.forEach(tabEl => {
    const tabLabel = tabEl.textContent.trim();
    const panelId = tabEl.getAttribute('aria-controls');
    const panel = panelMap[panelId];

    // Defensive: If no panel, skip this tab
    if (!panel) return;

    // Find the main content block for the tab
    // Most tabs use an article.cmp-contentfragment
    let mainContent = panel.querySelector('article.cmp-contentfragment');
    // If not present, fall back to the panel itself
    if (!mainContent) {
      // Find first non-empty child
      // Exclude empty grid divs
      const candidates = Array.from(panel.children).filter(child => {
        if (child.matches('.aem-Grid, .aem-Grid--12, .aem-Grid--default--12')) return false;
        return child.textContent.trim().length > 0 || child.querySelector('*');
      });
      mainContent = candidates.length > 0 ? candidates[0] : panel;
    }

    cells.push([tabLabel, mainContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original tabs block with the new table
  tabsRoot.replaceWith(block);
}
