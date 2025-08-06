/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main Tabs component within the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab label elements (<li role="tab">)
  const tabLabelEls = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  );

  // Get all tab panels (<div data-cmp-hook-tabs="tabpanel">)
  const tabPanelEls = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Map of panelId -> panel element
  const panelMap = {};
  tabPanelEls.forEach((panel) => {
    const id = panel.getAttribute('id');
    if (id) panelMap[id] = panel;
  });

  // Build rows for the Tabs block

  // 1. Header row: block name
  const headerRow = ['Tabs (tabs7)'];

  // 2. Tab label row: each cell contains the tab label (from <li>, as plain text preserving order)
  const tabLabelsRow = tabLabelEls.map((li) => {
    // Use a <strong> for semantic bold (matches visual example)
    const strong = document.createElement('strong');
    strong.textContent = li.textContent.trim();
    return strong;
  });

  // 3. Tab content row: each cell contains content for the tab, in order
  const tabPanelsRow = tabLabelEls.map((li) => {
    const panelId = li.getAttribute('aria-controls');
    const panelEl = panelMap[panelId];
    if (!panelEl) return '';
    // The actual content is usually inside a .contentfragment > article
    // We'll extract the <article> if present, or fall back to all children
    const contentFragment = panelEl.querySelector('.contentfragment > article') || panelEl.querySelector('article');
    if (contentFragment) {
      return [contentFragment];
    }
    // Otherwise, return all children (skip empty grids/divs if possible)
    const meaningful = Array.from(panelEl.children).filter(child => {
      // Skip empty grid containers commonly used for layout only
      if (child.classList.contains('aem-Grid')) return false;
      if (child.classList.contains('aem-GridColumn')) return false;
      if (child.classList.contains('aem-Grid--default--12')) return false;
      if (child.innerHTML.trim() === '') return false;
      return true;
    });
    return meaningful.length ? meaningful : Array.from(panelEl.childNodes);
  });

  // Compose the rows for the table
  const cells = [
    headerRow,
    tabLabelsRow,
    tabPanelsRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(block);
}
