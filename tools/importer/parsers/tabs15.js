/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cmp-tabs element inside any .tabs container
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Extract tab labels in order
  const tabLabelEls = tabsWrapper.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // Extract tab panels (in order)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build tab content row: for each panel, put all direct children (preserving HTML structure)
  const tabContentRow = tabPanels.map(panel => {
    const frag = document.createDocumentFragment();
    // Append all children of the panel (not the panel itself)
    Array.from(panel.childNodes).forEach(child => {
      if (
        child.nodeType === Node.ELEMENT_NODE ||
        (child.nodeType === Node.TEXT_NODE && child.textContent.trim())
      ) {
        frag.appendChild(child);
      }
    });
    return frag;
  });

  // Compose the table: header, tab labels row, tab contents row
  const cells = [
    ['Tabs (tabs15)'],
    tabLabels,
    tabContentRow,
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs block
  tabsWrapper.parentNode.replaceChild(table, tabsWrapper);
}
