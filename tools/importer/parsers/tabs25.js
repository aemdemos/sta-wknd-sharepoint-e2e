/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the correct .tabs.panelcontainer block (the tabs25 block root)
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs child (the main tabs structure)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist <ol>
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels (content for each tab, preserving order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll(':scope > div[role="tabpanel"]'));

  // Edge case: number of panels and labels mismatch?
  // We'll stop at the shortest.
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Build the table rows: first header, then each tab (label/content)
  const cells = [];
  // Header row as specified
  cells.push(['Tabs (tabs25)']);
  for (let i = 0; i < count; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // For content, reference the real panel content (do NOT clone)
    let contentCell = '';
    if (panel) {
      // Try to reference the main contentfragment/article inside the panel, or fallback to the whole panel
      let article = panel.querySelector('article');
      if (article) {
        contentCell = article;
      } else {
        // Remove tabindex and panel-specific ARIA attributes that would duplicate tab semantics
        contentCell = panel;
      }
    }
    cells.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabsContainer with the new block table
  tabsContainer.replaceWith(table);
}
