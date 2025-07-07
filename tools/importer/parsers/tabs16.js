/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cmp-tabs element inside the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels
  const tabList = tabsRoot.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach((li) => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract tab panel elements in the order they appear
  const tabPanels = Array.from(tabsRoot.querySelectorAll('div[role="tabpanel"]'));

  // Build table rows
  const cells = [];
  // Header row
  cells.push(['Tabs (tabs16)']);

  // Each tab: [label, content]
  for (let i = 0; i < tabPanels.length; i++) {
    const label = tabLabels[i] || `Tab ${i+1}`;
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the main article inside the tabpanel (for robustness, reference the whole panel if not found)
    let tabContent;
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      // Prefer the cmp-contentfragment__elements as the main content block
      const contentBlock = article.querySelector('.cmp-contentfragment__elements');
      if (contentBlock) {
        // Gather all the meaningful direct children of .cmp-contentfragment__elements, skipping empty grid wrappers
        const contentNodes = [];
        Array.from(contentBlock.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip grid-only wrappers
            if (
              node.classList.contains('aem-Grid') ||
              (node.tagName === 'DIV' && node.querySelector('.aem-Grid'))
            ) {
              // skip
            } else {
              contentNodes.push(node);
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim().length > 0) {
              // Text node, wrap in <span>
              const span = document.createElement('span');
              span.textContent = node.textContent;
              contentNodes.push(span);
            }
          }
        });
        tabContent = contentNodes.length > 0 ? contentNodes : [contentBlock];
      } else {
        tabContent = [article];
      }
    } else {
      // Fallback: Use all child nodes of the panel
      tabContent = Array.from(panel.childNodes).filter(
        (n) => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0)
      );
      if (tabContent.length === 0) tabContent = [panel];
    }
    // Reference the real element(s), not clones or HTML strings
    cells.push([label, tabContent]);
  }

  // Create table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(table);
}
