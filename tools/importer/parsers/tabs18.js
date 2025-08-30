/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all the tab labels (the <ol> list items)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (the content for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Build the header row
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  // Helper to extract the tab content from a panel
  function extractTabContent(panel) {
    // Try to find a .cmp-contentfragment inside the panel
    let cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Use the .cmp-contentfragment__elements if present
      let cfElements = cf.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Clean up empty .aem-Grid wrappers
        const grids = cfElements.querySelectorAll('.aem-Grid');
        grids.forEach(grid => {
          if (!grid.textContent.trim() && !grid.querySelector('img, p, h1, h2, h3, h4, h5, h6, ul, ol, li')) {
            grid.parentNode && grid.parentNode.removeChild(grid);
          }
        });
        // If there is only a single div remaining, unwrap it
        let candidate = cfElements;
        while (
          candidate.children.length === 1 &&
          candidate.firstElementChild &&
          candidate.firstElementChild.tagName === 'DIV'
        ) {
          candidate = candidate.firstElementChild;
        }
        return candidate;
      } else {
        return cf;
      }
    } else {
      // Fallback: use the tab panel itself
      return panel;
    }
  }

  // Build rows: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;
    const tabContent = extractTabContent(panel);
    rows.push([label, tabContent]);
  }

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
