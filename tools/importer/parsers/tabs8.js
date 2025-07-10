/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels in order
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];
  if (!tabLabelEls.length) return;

  // Collect tab labels as <strong> elements
  const tabLabels = tabLabelEls.map(tab => {
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });

  // Collect tab panel content in order
  const tabPanels = Array.from(tabs.querySelectorAll(':scope > div[role="tabpanel"]'));
  if (tabPanels.length !== tabLabels.length) return;
  const tabContents = tabPanels.map(panel => {
    // Prefer .contentfragment or article
    let contentEl = panel.querySelector('.contentfragment, article');
    if (!contentEl) {
      // fallback: non-empty children
      let found = false;
      const fallback = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === 1 && node.textContent && node.textContent.trim().length > 0) return true;
        if (node.nodeType === 3 && node.textContent && node.textContent.trim().length > 0) return true;
        return false;
      });
      return fallback.length ? fallback : '';
    }
    return contentEl;
  });

  // Build the 3-row table as required
  const cells = [
    ['Tabs (tabs8)'],
    tabLabels,
    tabContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
