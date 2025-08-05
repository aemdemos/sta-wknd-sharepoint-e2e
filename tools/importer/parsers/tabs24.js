/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element which contains the tab structure
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Find the tab labels in order
  const tabLabelEls = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Find all the tab panels in order
  const tabPanelEls = Array.from(tabsEl.querySelectorAll('[role="tabpanel"]'));

  // Compose header row (block name exactly as required)
  const headerRow = ['Tabs (tabs24)'];

  // Compose rows: each with [Tab Label, Tab Content]
  const rows = tabLabels.map((label, idx) => {
    let tabContent = null;
    const panelEl = tabPanelEls[idx];
    if (panelEl) {
      // Find the main content inside the tab panel
      // Often a contentfragment/article but may vary, so grab all children except empty div.aem-Grid
      const article = panelEl.querySelector('article.cmp-contentfragment');
      if (article) {
        tabContent = article;
      } else {
        // Use all non-empty children as the content
        const contentNodes = Array.from(panelEl.childNodes)
          .filter(node => {
            // Remove whitespace-only text nodes and empty grid containers
            if (node.nodeType === 3) {
              return node.textContent.trim().length > 0;
            }
            if (node.nodeType === 1) {
              // Remove empty .aem-Grid wrappers
              if (
                node.classList.contains('aem-Grid') &&
                node.children.length === 0 &&
                node.textContent.trim() === ''
              ) {
                return false;
              }
              // Filter out empty elements
              return node.textContent.trim().length > 0;
            }
            return false;
          });
        if (contentNodes.length === 1) {
          tabContent = contentNodes[0];
        } else if (contentNodes.length > 1) {
          tabContent = contentNodes;
        } else {
          tabContent = '';
        }
      }
    }
    return [label, tabContent];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsEl.replaceWith(table);
}
