/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabLabelEls = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));
  if (!tabLabelEls.length) return;

  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row: single cell, exactly as required
  const headerRow = ['Tabs (tabs12)'];
  // Tab headers row: N columns (one per tab)
  const tabHeaderRow = tabLabelEls.map(tabEl => tabEl.textContent.trim());

  // Rows: each with [tab label, tab content]
  const tabRows = tabLabelEls.map((tabEl, idx) => {
    const label = tabEl.textContent.trim();
    let content = '';
    const panel = tabPanels[idx];
    if (panel) {
      // Try to get the main content fragment inside the tab panel, fallback to panel contents
      let contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        // We'll exclude the .cmp-contentfragment__title (h3), and grab the rest
        const frag = document.createDocumentFragment();
        Array.from(contentFragment.childNodes).forEach(node => {
          if (!(node.nodeType === 1 && node.matches('h3.cmp-contentfragment__title'))) {
            frag.appendChild(node);
          }
        });
        content = frag;
      } else {
        // Fallback: everything inside the panel
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(node => {
          frag.appendChild(node);
        });
        content = frag;
      }
    }
    return [label, content];
  });

  // Compose cell structure
  const cells = [
    headerRow,
    tabHeaderRow,
    ...tabRows,
  ];

  // Create the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block
  tabsContainer.parentNode.replaceChild(block, tabsContainer);
}
