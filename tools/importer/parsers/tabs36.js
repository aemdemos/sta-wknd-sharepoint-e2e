/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const tabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels and tab panels in DOM order
  const tabLabelEls = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose rows: [label, content] for each tab
  const tabRows = tabLabelEls.map((li, idx) => {
    // Tab label as <strong>
    const label = document.createElement('strong');
    label.textContent = li.textContent.trim();
    // Tab content: reference .cmp-contentfragment if present, else the panel
    let content = null;
    if (tabPanels[idx]) {
      const frag = tabPanels[idx].querySelector('article.cmp-contentfragment');
      content = frag ? frag : tabPanels[idx];
    }
    return [label, content];
  });

  // Final table structure: header, then rows for each tab
  const cells = [
    ['Tabs (tabs36)'], // header row -- single cell
    ...tabRows        // one row per tab, [label, content]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsWrapper.replaceWith(block);
}
