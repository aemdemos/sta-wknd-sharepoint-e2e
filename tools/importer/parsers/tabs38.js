/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  let tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot && element.classList.contains('cmp-tabs')) {
    tabsRoot = element;
  }
  if (!tabsRoot) return;

  // Find tab headers (tab labels)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Find tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure number of panels matches number of labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build rows: header row, then one row per tab
  const rows = [];
  rows.push(['Tabs (tabs38)']);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // For tab content: collect all child nodes (preserving structure)
    let contentNodes = Array.from(panel.childNodes).filter(node => {
      // Ignore empty text nodes
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim();
    });
    // If only one content node, use it directly; else, wrap in a div
    let content;
    if (contentNodes.length === 1) {
      content = contentNodes[0];
    } else {
      const wrapper = document.createElement('div');
      contentNodes.forEach(n => wrapper.appendChild(n));
      content = wrapper;
    }
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the table
  tabsRoot.replaceWith(table);
}
