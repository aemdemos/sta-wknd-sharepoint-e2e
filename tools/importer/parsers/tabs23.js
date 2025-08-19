/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root. Prefer .tabs.panelcontainer, else first .cmp-tabs
  let tabsRoot = element.querySelector('.tabs.panelcontainer');
  let cmpTabs;
  if (tabsRoot) {
    cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  } else {
    cmpTabs = element.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabelEls = cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]');
  const tabLabels = Array.from(tabLabelEls).map(el => el.textContent.trim());

  // Get tab panels, in source order
  const tabPanelEls = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the block table. Header: ["Tabs (tabs23)"]
  const table = [];
  table.push(['Tabs (tabs23)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanelEls[i];
    if (!panel) continue;

    // Try to get the main contentfragment inside panel
    // We'll reference the contentfragment__elements block when possible
    let content = null;
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      // Try to find .cmp-contentfragment__elements (for AEM Content Fragment)
      let cfEls = article.querySelector('.cmp-contentfragment__elements');
      if (cfEls) {
        // Try to only get the meaningful non-grid content
        // We'll gather all direct children that are not grid wrappers
        let nodes = Array.from(cfEls.childNodes).filter((n) => {
          if (n.nodeType === 1 && n.classList.contains('aem-Grid')) return false;
          if (n.nodeType === 1 && n.classList.contains('aem-Grid--12')) return false;
          if (n.nodeType === 1 && n.classList.contains('aem-Grid--default--12')) return false;
          // Remove divs wrapping only grid
          if (n.nodeType === 1 && n.tagName === 'DIV' && n.querySelector('.aem-Grid')) {
            return false;
          }
          // Accept everything else
          return (n.nodeType !== 3 || n.textContent.trim()); // filter empty text nodes
        });
        if (nodes.length === 1) {
          content = nodes[0];
        } else if (nodes.length > 1) {
          content = nodes;
        } else {
          // fallback to whole .cmp-contentfragment__elements
          content = cfEls;
        }
      } else {
        // fallback to the article itself
        content = article;
      }
    } else {
      // fallback: take all child nodes of panel, filtering out empty grids
      let children = Array.from(panel.childNodes).filter(n => {
        if (n.nodeType === 1 && n.classList.contains('aem-Grid')) return false;
        if (n.nodeType === 1 && n.classList.contains('aem-Grid--12')) return false;
        if (n.nodeType === 1 && n.classList.contains('aem-Grid--default--12')) return false;
        return (n.nodeType !== 3 || n.textContent.trim());
      });
      if (children.length === 1) {
        content = children[0];
      } else {
        content = children;
      }
    }
    table.push([label, content]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  // Replace the tabs block with the block table
  cmpTabs.replaceWith(block);
}
