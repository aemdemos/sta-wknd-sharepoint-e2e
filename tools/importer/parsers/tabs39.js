/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cmp-tabs element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels from the tablist (in order)
  const tabLabelElements = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Get all tab panel elements (in order from DOM)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the block table structure
  const headerRow = ['Tabs (tabs39)'];
  const cells = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Use direct children of tab panel for robust structure
    // Remove cmp-contentfragment__title from contentFragment if present (match original spec)
    // Reference existing DOM nodes directly
    let tabContentElem = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Remove the title if present
      const titleElem = contentFragment.querySelector('h3.cmp-contentfragment__title');
      if (titleElem) titleElem.remove();
      // Remove empty aem-Grid divs inside contentfragment
      const grids = contentFragment.querySelectorAll('div.aem-Grid');
      grids.forEach(g => {
        if (!g.textContent.trim() && !g.querySelector('img,ul,ol,p,h1,h2,h3,h4,h5,h6')) {
          g.remove();
        }
      });
      // Remove empty divs directly under .cmp-contentfragment__elements
      const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        const emptyDivs = cfElements.querySelectorAll(':scope > div');
        emptyDivs.forEach(div => {
          if (!div.textContent.trim() && div.children.length === 0) div.remove();
        });
      }
      // Use all children of cmp-contentfragment__elements
      const cfElementsMain = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (cfElementsMain) {
        // Omit empty aem-Grid divs
        const nodes = Array.from(cfElementsMain.childNodes).filter(n => {
          return !(n.nodeType === 1 && n.matches('div.aem-Grid') && !n.textContent.trim());
        });
        tabContentElem = nodes.length === 1 ? nodes[0] : nodes;
      } else {
        // fallback: use contentFragment itself
        tabContentElem = contentFragment;
      }
    } else {
      // fallback: use all children of panel
      const kids = Array.from(panel.childNodes).filter(n => {
        return !(n.nodeType === 1 && n.matches('div.aem-Grid') && !n.textContent.trim());
      });
      tabContentElem = kids.length === 1 ? kids[0] : kids;
    }
    cells.push([
      label,
      tabContentElem,
    ]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the cmp-tabs element only!
  tabsRoot.replaceWith(block);
}
