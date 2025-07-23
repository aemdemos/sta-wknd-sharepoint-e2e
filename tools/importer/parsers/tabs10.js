/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the provided element
  const tabsWrapper = element.querySelector('.cmp-tabs');
  if (!tabsWrapper) return;

  // Get all tab labels from the tablist
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Find all tab panels (content for each tab)
  const panels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel[data-cmp-hook-tabs="tabpanel"]'));

  // Compose the table rows
  const cells = [];
  // Header row: the block name exactly as required
  cells.push(['Tabs (tabs10)']);

  // For each tab, add a row: [ tab label, tab content ]
  panels.forEach((panel, idx) => {
    // Tab label for this panel
    const label = tabLabels[idx] || `Tab ${(idx+1)}`;

    // The main content for the tab: try to find the contentfragment or else use the panel
    let content = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // To reference the existing element, we remove only the <h3> title of the contentfragment if it matches the tab label (for conciseness in tab UI)
      const title = contentFragment.querySelector('.cmp-contentfragment__title');
      if (title && (title.textContent.trim() === label || title.textContent.trim() === 'Colorado Rock Climbing')) {
        title.remove();
      }
      // Remove empty .aem-Grid containers for cleaner output
      contentFragment.querySelectorAll('.aem-Grid').forEach(grid => {
        if (!grid.textContent.trim() && !grid.querySelector('img,ul,ol,table,iframe,video')) {
          grid.remove();
        }
      });
      content = contentFragment;
    } else {
      // fallback: use the panel itself
      // Clean up empty .aem-Grid from the panel for robustness
      panel.querySelectorAll('.aem-Grid').forEach(grid => {
        if (!grid.textContent.trim() && !grid.querySelector('img,ul,ol,table,iframe,video')) {
          grid.remove();
        }
      });
      content = panel;
    }

    cells.push([label, content]);
  });

  // Create the block table using the helper
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new block table
  tabsWrapper.replaceWith(table);
}
