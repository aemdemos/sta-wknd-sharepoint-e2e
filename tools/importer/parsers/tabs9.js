/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels from the <li> elements
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tabpanels and their content, in source order
  const tabPanels = tabsEl.querySelectorAll('[role="tabpanel"]');
  // Defensive: skip if no tabs
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the rows for the block
  const headerRow = ['Tabs (tabs9)'];

  // 2nd row: all tab labels (as header) in a row
  // In the example, the labels are in one row, each cell is a string
  const labelsRow = tabLabels;

  // 3rd row: all tab content in a row, matching tab order
  // In the example, each cell corresponds to tab content
  const contentsRow = [];
  tabPanels.forEach((tabpanel) => {
    // Sometimes content is deep inside .contentfragment, sometimes direct children
    // We'll collect the meaningful content from the tabpanel
    // Find first .cmp-contentfragment__elements or direct children with content
    let content = null;
    // Prefer .cmp-contentfragment__elements (usually holds all tab contents)
    const cfEl = tabpanel.querySelector('.cmp-contentfragment__elements');
    if (cfEl) {
      content = cfEl;
    } else {
      // fallback: get all direct children except h3 (title)
      const toAppend = [];
      tabpanel.childNodes.forEach((node) => {
        if (node.nodeType === 1 && node.tagName !== 'H3') {
          toAppend.push(node);
        }
        if (node.nodeType === 3 && node.textContent.trim()) {
          // Text node with content
          toAppend.push(document.createTextNode(node.textContent));
        }
      });
      // If nothing, use the tabpanel itself
      if (toAppend.length) {
        // Wrap multiple elements in a div to keep together
        const container = document.createElement('div');
        toAppend.forEach(el => container.appendChild(el));
        content = container;
      } else {
        content = tabpanel;
      }
    }
    contentsRow.push(content);
  });

  // Compose the table
  const tableRows = [headerRow, labelsRow, contentsRow];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the cmp-tabs element with the new block table
  tabsEl.replaceWith(table);
}
