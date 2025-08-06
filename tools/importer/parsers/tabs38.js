/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Locate the tab label elements in order
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  const labels = tabLabelEls.map(el => el.textContent.trim());

  // Locate all tabpanels in order
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose table rows: first row is header, then one row per tab
  const tableRows = [];
  // Header row as in the specification
  tableRows.push(['Tabs (tabs38)']);
  // For each tab, create a row [label, content]
  for (let i = 0; i < tabPanels.length; i++) {
    const panel = tabPanels[i];
    // Dynamically reference the tab label as plain text, not as a DOM element
    const tabLabel = labels[i] || `Tab ${i+1}`;

    // For content, we want all the child nodes inside the panel, not the panel's wrapper
    // Remove aria, class, etc wrappers: keep only meaningful content
    // Most panels have a single .contentfragment as their content
    let contentCell;
    const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (cf) {
      contentCell = cf;
    } else {
      // Fallback: all children of the panel
      const nodes = Array.from(panel.childNodes).filter(n => {
        // skip empty text nodes
        return n.nodeType !== 3 || n.textContent.trim().length > 0;
      });
      // If only one actual element, use it, otherwise pass as an array
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else {
        contentCell = nodes;
      }
    }

    tableRows.push([tabLabel, contentCell]);
  }

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  tabsContainer.replaceWith(table);
}
