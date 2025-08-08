/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row with exact block name
  const cells = [['Tabs (tabs20)']];

  // For each tab, get the label and its corresponding panel content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] ? tabLabels[i].textContent.trim() : '';
    let contentCell = '';
    if (tabPanels[i]) {
      // Instead of cloning, reference the first element child with its contents
      // We'll extract all valid child nodes of the tab panel into a fragment, referencing those nodes
      const fragment = document.createDocumentFragment();
      // Only reference direct child nodes (so that any structure is preserved)
      Array.from(tabPanels[i].childNodes).forEach(node => {
        // Reference existing element node from the document for import, do not clone
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          fragment.appendChild(node);
        }
      });
      // If the fragment has nodes, use it; otherwise, use empty string
      contentCell = fragment.childNodes.length > 0 ? fragment : '';
    }
    cells.push([label, contentCell]);
  }

  // Create the table block from cells
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
