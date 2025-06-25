/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container within the given element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Get tab panels (one per tab, must match order)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[role="tabpanel"]'));

  // For each tab panel, extract the detailed content for the tab
  const tabContents = tabPanels.map(panel => {
    // Try to find the main content under the contentfragment/article
    let article = panel.querySelector('article.cmp-contentfragment');
    if (!article) return panel; // fallback: use the whole panel
    // Inside article, get .cmp-contentfragment__elements (should be one per tab panel)
    const elWrap = article.querySelector('.cmp-contentfragment__elements');
    if (!elWrap) return article;
    // The actual content is typically all children of .cmp-contentfragment__elements except empty grids
    const nodes = Array.from(elWrap.children).filter(child => {
      // Remove grid wrappers that have no image or visible content
      if (child.querySelector('.aem-Grid')) {
        const grid = child.querySelector('.aem-Grid');
        // If the grid has at least one image or any non-empty content, keep it
        if (grid && (grid.querySelector('img') || grid.textContent.trim().length > 0)) {
          return true;
        }
        // Skip empty .aem-Grid wrappers
        if (grid && grid.children.length === 0 && grid.textContent.trim().length === 0) {
          return false;
        }
      }
      return true;
    });
    // If we have nodes, return them as an array, otherwise return the wrapper
    return nodes.length > 0 ? nodes : [elWrap];
  });

  // Assemble the table structure: first row is the header (single cell), then each subsequent row is [Tab Label, Tab Content]
  const rows = [
    ['Tabs (tabs34)'],
    ...tabLabels.map((label, idx) => [label, tabContents[idx]]),
  ];

  // Construct the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
