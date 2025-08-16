/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist (li under .cmp-tabs__tablist)
  const tabLabelElements = tabsBlock.querySelectorAll('.cmp-tabs__tablist > li');
  if (!tabLabelElements.length) return;

  // Get all tab panels in their DOM order
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Compose the header row with the block name as in the requirements
  const headerRow = ['Tabs (tabs13)'];

  // Compose the tab labels row (in order, one cell per tab)
  const tabLabelsRow = Array.from(tabLabelElements).map(tab => tab.textContent.trim());

  // Each panel's content as a cell, referencing existing elements, preserving their original HTML structure
  const tabContentCells = Array.from(tabPanels).map(panel => {
    // Find the main content for this panel
    // The actual content is usually within a .contentfragment, but some wrappers/divs may exist
    // We'll extract all children of the panel except script/style
    const children = Array.from(panel.childNodes).filter(n =>
      n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
    );
    // If only one child and it's a div or article, use it directly
    if (children.length === 1 && (children[0].nodeType === 1)) {
      return children[0];
    } else {
      // Otherwise, wrap in a fragment div for robustness
      const frag = document.createElement('div');
      children.forEach(child => frag.appendChild(child));
      return frag;
    }
  });

  // Compose the table cell rows: header, tab labels, then a single row with all tab content cells
  const cells = [
    headerRow,
    tabLabelsRow,
    tabContentCells,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(block);
}
