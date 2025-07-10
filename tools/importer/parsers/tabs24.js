/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from .cmp-tabs__tablist > .cmp-tabs__tab
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (contents), in order
  const tabPanelEls = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose the header row exactly as required
  const headerRow = ['Tabs (tabs24)'];

  // Build the first row: all tab labels as <strong> elements in an array
  const tabLabelCells = tabLabelEls.map((tabLabelEl) => {
    const strong = document.createElement('strong');
    strong.textContent = tabLabelEl.textContent.trim();
    return strong;
  });
  const firstRow = [tabLabelCells];

  // Build one row per tab: just the tab content (as a single cell per row)
  // Get the main content inside each tabpanel.
  const contentRows = tabPanelEls.map((panel) => {
    // Try to extract the main content fragment or just use the panel
    let content = null;
    // Often it's inside a .contentfragment, or inside <article>
    const frag = panel.querySelector('.contentfragment') || panel.querySelector('article');
    if (frag) {
      content = frag;
    } else {
      // fallback to panel's children or panel itself
      if (panel.children.length === 1) {
        content = panel.firstElementChild;
      } else {
        content = panel;
      }
    }
    return [content];
  });

  // Compose cells array
  const cells = [headerRow, firstRow, ...contentRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs element in the document
  tabs.replaceWith(block);
}
