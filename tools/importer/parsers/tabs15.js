/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the provided root element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (keep order)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabItems = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);

  // Get tab panels (order assumed to match tab labels)
  // Note: Only direct children to avoid nested panels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row: block name exactly as specified
  const cells = [['Tabs (tabs15)']];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabItems.length; i++) {
    const tabItem = tabItems[i];
    const label = tabItem.textContent.trim();
    let panel = tabPanels[i];
    if (!panel) {
      // Defensive: try aria-controls
      const panelId = tabItem.getAttribute('aria-controls');
      panel = panelId ? tabs.querySelector(`#${panelId}`) : null;
    }
    let content = null;
    if (panel) {
      // Prefer the main content inside the panel: contentfragment/article, otherwise whole panel
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Use direct children, but skip empty grid wrappers
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(child => {
          if (child.nodeType === 1) {
            // skip empty or invisible grid wrappers
            if (child.matches('.aem-Grid, .aem-Grid--12') && !child.textContent.trim()) {
              return;
            }
          }
          frag.appendChild(child.cloneNode(true));
        });
        content = frag.childNodes.length === 1 ? frag.firstChild : frag;
      }
    } else {
      content = document.createTextNode('');
    }
    cells.push([label, content]);
  }

  // Replace element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
