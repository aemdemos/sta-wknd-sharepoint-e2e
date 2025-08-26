/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (the element with class 'cmp-tabs')
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  // Get the tab panels (content for each tab)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table rows: header row first (as per block name)
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  // For edge case: fewer panels than labels or vice versa, match by order
  for (let idx = 0; idx < tabLabels.length; idx++) {
    const tabLabel = tabLabels[idx];
    const tabName = tabLabel ? tabLabel.textContent.trim() : '';
    let tabContent = '';
    const panel = tabPanels[idx];
    if (panel) {
      // Reference immediate children of the tabpanel, preserving structure
      // If there's a single (element) child, use it; if multiple, wrap in fragment
      const contentNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === 1) return true; // element
        if (node.nodeType === 3 && node.textContent.trim() !== '') return true; // text
        return false;
      });
      if (contentNodes.length === 1) {
        tabContent = contentNodes[0];
      } else if (contentNodes.length > 1) {
        // Use a DocumentFragment to avoid unnecessary div wrappers
        const fragment = document.createDocumentFragment();
        contentNodes.forEach(node => fragment.appendChild(node));
        tabContent = fragment;
      }
    }
    rows.push([tabName, tabContent]);
  }

  // Create the block table with exactly the structure in the example
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabs.replaceWith(table);
}
