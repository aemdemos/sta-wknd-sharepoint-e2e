/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels in order
  const tabLabelEls = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  );
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all tab panels (in order)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabLabels.length !== tabPanels.length) return;

  // Build table: first row is single cell block name
  const tableRows = [['Tabs (tabs28)']];
  // Each subsequent row: [Tab Label, Tab Content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    // Extract all meaningful content from tab panel
    const contentElements = [];
    for (const node of panel.childNodes) {
      if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        contentElements.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        contentElements.push(span);
      }
    }
    tableRows.push([label, contentElements.length === 1 ? contentElements[0] : contentElements]);
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  tabsRoot.replaceWith(table);
}
