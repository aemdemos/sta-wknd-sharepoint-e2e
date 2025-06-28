/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and tab panels in order
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Helper to filter out empty grid/layout divs
  function filterContent(nodes) {
    return Array.from(nodes).filter(child => {
      if (!child) return false;
      if (child.nodeType !== 1) return true; // Keep non-element nodes
      // Remove .aem-Grid, empty divs, and divs with only .aem-Grid
      if (child.matches('.aem-Grid')) return false;
      if (child.tagName === 'DIV') {
        if (child.children.length === 1 && child.firstElementChild.matches('.aem-Grid')) return false;
        if (child.innerHTML.trim() === '') return false;
      }
      return true;
    });
  }

  // Build one row per tab: [Tab Label, Tab Content]
  const tabRows = tabLabels.map((tabLabel, idx) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    let tabContent;
    // Try to find .cmp-contentfragment__elements
    const cfElements = panel.querySelector('.cmp-contentfragment__elements');
    if (cfElements) {
      const filtered = filterContent(cfElements.children);
      if (filtered.length === 1) {
        tabContent = filtered[0];
      } else if (filtered.length > 1) {
        tabContent = filtered;
      } else {
        tabContent = '';
      }
    } else {
      // fallback: use filtered direct children of panel
      const filtered = filterContent(panel.children);
      if (filtered.length === 1) {
        tabContent = filtered[0];
      } else if (filtered.length > 1) {
        tabContent = filtered;
      } else {
        tabContent = '';
      }
    }
    return [label, tabContent];
  });

  // Table: header row (one cell), then each tab as [label, content]
  const cells = [
    ['Tabs (tabs23)'],
    ...tabRows
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
