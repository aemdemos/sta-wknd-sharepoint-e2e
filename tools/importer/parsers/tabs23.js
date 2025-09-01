/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (in order)
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(el => el.textContent.trim());

  // Get tab panels (in order, must match tab order)
  // Each panel has id referenced by aria-controls from tab
  const tabPanels = tabLabelEls.map(tabEl => {
    const ariaControls = tabEl.getAttribute('aria-controls');
    return ariaControls ? tabs.querySelector(`#${ariaControls}`) : null;
  });

  // Compose the table rows (header row, then one per tab)
  const headerRow = ['Tabs (tabs23)'];
  const cells = [headerRow];

  tabLabels.forEach((label, i) => {
    let contentCell = document.createTextNode('');
    const panel = tabPanels[i];
    if (panel) {
      // Try to find the .cmp-contentfragment__elements (most content is here)
      let cfElements = panel.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        contentCell = cfElements;
      } else {
        // If not found, look for article.cmp-contentfragment
        let cf = panel.querySelector('.cmp-contentfragment');
        if (cf) {
          contentCell = cf;
        } else {
          // Fallback: use all children of the panel
          // Create a fragment for all children
          const frag = document.createDocumentFragment();
          Array.from(panel.childNodes).forEach(child => frag.appendChild(child));
          contentCell = frag;
        }
      }
    }
    cells.push([label, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.parentNode.replaceChild(table, element);
}
