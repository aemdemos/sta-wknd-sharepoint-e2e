/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tab list
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabHeaderItems = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);

  // Get the tab panels (tab contents) in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row must match example exactly
  const headerRow = ['Tabs (tabs37)'];

  // Build tab rows: each row [Label, Content]
  const rows = tabHeaderItems.map((tabItem, i) => {
    // 1st cell: tab label text
    const label = tabItem.textContent.trim();

    // 2nd cell: tab content
    let contentCell;
    const panel = tabPanels[i];
    if (panel) {
      // Try to get main content container if present (.cmp-contentfragment__elements)
      let contentFragment = panel.querySelector('.cmp-contentfragment__elements');

      if (contentFragment) {
        // Collect all non-empty child nodes, excluding empty grids
        let nodes = [];
        Array.from(contentFragment.children).forEach(child => {
          // Ignore empty grids
          if (child.classList.contains('aem-Grid')) {
            if (child.textContent.trim()) nodes.push(child);
          } else {
            // Push if not empty or is an img/ul/ol/p
            if (
              child.textContent.trim() ||
              child.querySelector('img,ul,ol,p')
            ) {
              nodes.push(child);
            }
          }
        });
        // If only one meaningful node, use it directly, else pass array
        if (nodes.length === 1) {
          contentCell = nodes[0];
        } else if (nodes.length > 1) {
          contentCell = nodes;
        } else {
          // fallback: use contentFragment itself
          contentCell = contentFragment;
        }
      } else {
        // fallback: first <article>, or first <p>/<ul>/<ol>/<img>, or panel itself
        const article = panel.querySelector('article');
        if (article) {
          contentCell = article;
        } else {
          const firstContent = panel.querySelector('p,ul,ol,img');
          if (firstContent) {
            contentCell = firstContent;
          } else {
            contentCell = panel;
          }
        }
      }
    } else {
      // If tab panel missing, just empty string
      contentCell = '';
    }
    return [label, contentCell];
  });

  // Compose final table cells array
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the block element with the structured table
  element.replaceWith(table);
}
