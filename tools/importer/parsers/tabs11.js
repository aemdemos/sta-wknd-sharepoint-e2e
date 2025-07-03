/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels in order
  const tabLabels = [];
  const tabList = tabsRoot.querySelector('ol[role="tablist"]');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Extract tab panels in their appearing order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // The header row should be a single cell (one column), as per the prompt
  const cells = [["Tabs (tabs11)"]];

  // Each subsequent row should be an array of two cells: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let content = '';
    if (tabPanels[i]) {
      // For each tab panel, collect all its contents into a fragment, referencing original nodes
      const frag = document.createDocumentFragment();
      Array.from(tabPanels[i].childNodes).forEach(node => {
        // Only append significant nodes (ignore empty text nodes)
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        frag.appendChild(node);
      });
      content = frag.childNodes.length === 1 ? frag.firstChild : frag;
    }
    cells.push([label, content]);
  }
  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
