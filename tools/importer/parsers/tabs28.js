/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (tablist) {
    const labelNodes = tablist.querySelectorAll('li[role="tab"]');
    labelNodes.forEach((li) => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels (content), order should match tabLabels
  const tabPanels = [];
  tabLabels.forEach((_, i) => {
    // panel id can be found by matching the aria-controls
    const li = tablist ? tablist.querySelectorAll('li[role="tab"]')[i] : null;
    let panel = null;
    if (li && li.getAttribute('aria-controls')) {
      panel = tabs.querySelector(`#${li.getAttribute('aria-controls')}`);
    }
    // fallback: use nth panel
    if (!panel) {
      panel = tabs.querySelectorAll('.cmp-tabs__tabpanel')[i];
    }
    tabPanels.push(panel);
  });

  // Compose the table rows:
  // 1. Block name header
  // 2. Tabs header row (tab labels)
  // 3. Tabs content row (tab panel content)
  const rows = [];
  rows.push(['Tabs (tabs28)']);
  rows.push(tabLabels);

  // Get tab content for each panel
  const contentRow = tabPanels.map((panel) => {
    if (panel) {
      // Prefer to reference the main article or contentfragment inside each tabpanel
      // If not found, use the panel itself
      const contentElements = [];
      // Find the first contentfragment or article in the panel
      const article = panel.querySelector('article.cmp-contentfragment');
      if (article) {
        contentElements.push(article);
      } else {
        // fallback: get all direct children (excluding empty layout divs)
        Array.from(panel.children).forEach(child => {
          if (
            child.classList.contains('aem-Grid') &&
            child.children.length === 0
          ) {
            // skip empty grid wrappers
            return;
          }
          contentElements.push(child);
        });
      }
      // If nothing found, use panel itself
      if (contentElements.length === 0) contentElements.push(panel);
      return contentElements;
    } else {
      // Defensive: fallback to empty cell
      return '';
    }
  });
  rows.push(contentRow);

  // Create and replace the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
