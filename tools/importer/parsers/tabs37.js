/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels
  const tabLabelEls = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );
  if (tabLabelEls.length === 0) return;

  // Extract tab panels (each one corresponds to a tab content)
  const tabPanelEls = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: make sure number of panels matches number of labels
  const numTabs = Math.min(tabLabelEls.length, tabPanelEls.length);
  if (numTabs === 0) return;

  // Build the header row exactly as required (one column only)
  const headerRow = ['Tabs (tabs37)'];

  // Now build each tab row: [tab label, tab content]
  const tabRows = [];
  for (let i = 0; i < numTabs; i++) {
    // Tab label
    const label = tabLabelEls[i].textContent.trim();
    // Tab content: Prefer the main contentfragment/article, fallback to all children
    const panel = tabPanelEls[i];
    let tabContent;
    const cf = panel.querySelector('.cmp-contentfragment, .contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // capture all non-empty children
      const children = Array.from(panel.childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim() !== '');
      if (children.length === 1) {
        tabContent = children[0];
      } else if (children.length > 1) {
        tabContent = children;
      } else {
        tabContent = '';
      }
    }
    tabRows.push([label, tabContent]);
  }

  // Assemble the cells for the createTable function
  // Table is: header row (1 col), then one row for each tab [label, content]
  const cells = [
    headerRow,
    ...tabRows
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
