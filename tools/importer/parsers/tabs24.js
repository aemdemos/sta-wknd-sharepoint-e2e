/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels and panels. Panels may not be in order, so use aria-controls/aria-labelledby
  const tabLabelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build a mapping from tab id (without -tab) to panel element
  const panelMap = {};
  tabPanelEls.forEach(panel => {
    // panel's id is like tabs-ce1dd44caf-item-e601701bc3-tabpanel
    // its aria-labelledby links to the tab label id, e.g. tabs-ce1dd44caf-item-e601701bc3-tab
    const tabId = panel.getAttribute('aria-labelledby');
    if (tabId) {
      panelMap[tabId] = panel;
    }
  });

  // Header row as in the example, with correct block name
  const headerRow = ['Tabs (tabs24)'];

  // Build rows for each tab
  const tabRows = tabLabelEls.map(tabLabelEl => {
    const label = tabLabelEl.textContent.trim();
    const tabId = tabLabelEl.id;
    // Find the corresponding panel by aria-labelledby
    const panel = panelMap[tabId];
    let content = '';
    if (panel) {
      // Reference the contentfragment directly, if present
      // Otherwise, use all children of the panel
      const cf = panel.querySelector(':scope > .contentfragment, :scope > article.cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // Gather all children
        const nodes = Array.from(panel.childNodes).filter(
          n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== '')
        );
        if (nodes.length > 1) {
          // Wrap in a div for grouping
          const div = document.createElement('div');
          nodes.forEach(n => div.appendChild(n));
          content = div;
        } else if (nodes.length === 1) {
          content = nodes[0];
        }
      }
    }
    return [label, content];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...tabRows
  ], document);
  
  // Replace the tabsRoot only, not the entire parent element
  tabsRoot.replaceWith(table);
}
