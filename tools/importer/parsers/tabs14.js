/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (looks for .cmp-tabs inside the provided element)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabEls = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Map tab panels by their IDs
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  const panelMap = {};
  tabPanels.forEach(panel => {
    const id = panel.getAttribute('id');
    if (id) panelMap[id] = panel;
  });

  // Build rows for each tab
  const tabRows = tabEls.map(tabEl => {
    const label = tabEl.textContent.trim();
    const controlsId = tabEl.getAttribute('aria-controls');
    const panel = panelMap[controlsId];
    let contentCell = null;
    if (panel) {
      // Prefer .contentfragment, else use all children
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        contentCell = contentFragment;
      } else {
        // Use all (non-empty) children of the panel in an array
        const children = Array.from(panel.childNodes).filter(n => {
          // Only include non-empty text or element nodes
          if (n.nodeType === 3) return n.textContent.trim().length > 0;
          if (n.nodeType === 1) return true;
          return false;
        });
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        }
      }
    }
    return [label, contentCell];
  });

  // Construct the block table
  const cells = [
    ['Tabs (tabs14)'], // Header row matches block name variant
    ...tabRows
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
