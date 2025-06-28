/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Locate the cmp-tabs element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 2. Get tab labels in order
  const tabLabelNodes = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  const tabLabels = tabLabelNodes.map(li => li.textContent.trim());

  // 3. Get tab panels (must match order of labels)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only as many labels/panels as the min length
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // 4. Prepare rows: header, then a row for each tab
  const rows = [];
  rows.push(['Tabs (tabs30)']);
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i] || '';
    // For content: use everything inside the tabpanel (not just .contentfragment)
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // Collect all immediate children inside the panel
      // Remove empty text nodes and whitespace-only divs/grids
      const panelChildren = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // filter out empty grid wrappers
          if (
            node.matches('.aem-Grid, .aem-Grid--12, .aem-Grid--default--12') &&
            node.textContent.trim() === ''
          ) {
            return false;
          }
          return true;
        }
        return false;
      });
      // If only one child, just use it; else, pass the array
      if (panelChildren.length === 1) {
        contentCell = panelChildren[0];
      } else if (panelChildren.length > 1) {
        contentCell = panelChildren;
      } else {
        // fallback
        contentCell = '';
      }
    } else {
      contentCell = '';
    }
    rows.push([label, contentCell]);
  }

  // 5. Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // 6. Replace the original element
  tabsRoot.replaceWith(table);
}
