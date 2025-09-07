/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    // If mismatch, do not proceed
    return;
  }

  // Build table rows: header first
  const cells = [ ['Tabs (tabs37)'] ];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;

    // Tab label cell
    const labelCell = label;

    // Tab content cell: preserve all content, including images, lists, etc.
    // Use a DocumentFragment to collect all children
    const frag = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach(node => {
      // Only append element or text nodes (skip empty text nodes)
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        frag.appendChild(node.cloneNode(true));
      }
    });

    cells.push([labelCell, frag]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
