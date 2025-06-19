/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels (li elements in the tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = Array.from(tabList ? tabList.children : []);

  // Extract tab panel content in DOM order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // For each tab, create a row: [label, content]
  const tabRows = tabLabelEls.map((tab, idx) => {
    // Tab label as plain text (preserve strong if present in the label)
    // To support possible <strong> or other markup, use innerHTML in a span
    const label = document.createElement('span');
    label.innerHTML = tab.innerHTML.trim();
    // Tab content:
    const panel = tabPanels[idx];
    let content;
    if (panel) {
      if (panel.children.length === 1) {
        content = panel.firstElementChild;
      } else {
        // Use all element and non-empty text nodes
        content = Array.from(panel.childNodes).filter(n =>
          n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== '')
        );
      }
    } else {
      content = '';
    }
    return [label, content];
  });

  // Build the table structure: header, then one row per tab
  const headerRow = ['Tabs (tabs28)'];
  const cells = [headerRow, ...tabRows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
