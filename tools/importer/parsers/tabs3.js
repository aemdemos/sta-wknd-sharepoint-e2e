/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .cmp-tabs block which contains the tab interface
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract all tab labels from the tab list, in order
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Extract all tab panels in order
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  const rows = [
    ['Tabs (tabs3)']
  ];

  // For each tab: add a row with tab label and content (content as element or array)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Remove aria-hidden panels for robustness (but will typically be all panels)
      // Extract all element nodes and non-empty text nodes
      const children = Array.from(panel.childNodes).filter(
        node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim() !== '')
      );
      if (children.length === 1) {
        content = children[0];
      } else if (children.length > 1) {
        content = children;
      } else {
        // fallback to empty string node
        content = document.createTextNode('');
      }
    } else {
      content = document.createTextNode('');
    }
    rows.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}
