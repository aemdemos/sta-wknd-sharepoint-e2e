/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels
  const tabLabelEls = tabsRoot.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // Get tab panels (may not be in DOM order! Let's get them by aria-controls)
  const tabPanelMap = {};
  tabLabelEls.forEach(li => {
    const controls = li.getAttribute('aria-controls');
    if (controls) {
      const panel = tabsRoot.querySelector(`#${controls}`);
      if (panel) tabPanelMap[li.textContent.trim()] = panel;
    }
  });

  // Table header row matches block name exactly
  const rows = [['Tabs (tabs23)']];

  // For each tab, add a row: [label, content]
  tabLabels.forEach(label => {
    // Get the panel for this label
    const panel = tabPanelMap[label];
    let contentCell = '';
    if (panel) {
      // Use the first cmp-contentfragment if present, else all children (skip empty grid wrappers)
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        // Try to find the main content, skip empty grids/divs
        const children = Array.from(panel.childNodes).filter(node => {
          if (node.nodeType === 1) {
            // element node
            if (
              node.classList.contains('aem-Grid') ||
              node.classList.contains('aem-GridColumn') ||
              node.classList.contains('cmp-tabs__tabpanel')
            ) {
              return false;
            }
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return false;
          } else if (node.nodeType === 3) {
            // text node
            if (!node.textContent.trim()) return false;
          }
          return true;
        });
        contentCell = children.length === 1 ? children[0] : children;
      }
    }
    rows.push([label, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
