/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist (ol > li)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels by order (should match tabLabels order)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the header row: block name only, exactly one column as specified
  const tableRows = [
    ['Tabs (tabs37)']
  ];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    let contentFragment = panel.querySelector('article');
    let content;
    if (contentFragment) {
      content = contentFragment;
    } else {
      const childNodes = Array.from(panel.childNodes).filter(n => (
        n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim().length > 0)
      ));
      content = childNodes.length === 1 ? childNodes[0] : childNodes;
    }
    tableRows.push([label, content]);
  }

  // Create the table and replace the original tabs block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
