/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: look for a .cmp-tabs inside the root element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Gather all tab labels, in order
  const tabLabelEls = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  const tabLabels = tabLabelEls.map((tab) => tab.textContent.trim());

  // Gather all tabpanel elements, corresponding by index to each tab
  const tabPanels = tabLabelEls.map((tabEl) => {
    const controlsId = tabEl.getAttribute('aria-controls');
    if (!controlsId) return null;
    // The panel may not exist; handle gracefully
    return tabsRoot.querySelector(`#${controlsId}`) || null;
  });

  // Build the cells array as per spec: header, tab label row, tab contents row
  const headerRow = ['Tabs (tabs19)'];
  const labelsRow = tabLabels;
  const contentsRow = tabPanels.map((panel) => {
    if (!panel) return '';
    // Reference the actual content block for the tab. Prefer the <article> if present (for structural consistency).
    const article = panel.querySelector('article');
    if (article) return article;
    // If no <article>, return panel content (commonly for simple tabs)
    // If panel only contains one div, unwrap it to avoid extra nesting
    let onlyDiv = panel.childElementCount === 1 && panel.firstElementChild.tagName === 'DIV';
    if (onlyDiv && panel.firstElementChild.childElementCount > 0) {
      return Array.from(panel.firstElementChild.children);
    }
    return Array.from(panel.childNodes);
  });

  // Compose table rows
  const cells = [
    headerRow,
    labelsRow,
    contentsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
