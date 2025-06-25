/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (.cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels (tab names)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  if (tabLabels.length === 0) return; // Defensive: no tabs found

  // Extract tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabPanels.length === 0) return; // Defensive: no panels found

  // Compose the header row with the exact block name
  const headerRow = ['Tabs (tabs25)'];

  // Compose the row with tab names, preserving HTML formatting
  const tabNameRow = tabLabels.map(label => {
    // If label has HTML formatting, use its childNodes
    // But label is <li>, which is not a valid table cell, so wrap in <span>
    const span = document.createElement('span');
    // Use .innerHTML so bold or italic or other formatting is preserved
    span.innerHTML = label.innerHTML;
    return span;
  });

  // Compose the content row: for each panel, reference its content
  const tabContentRow = tabPanels.map(panel => {
    // Collect all non-empty nodes inside the tabpanel to preserve layout
    // This could be .childNodes or just use all element children (safest: childNodes so text is preserved)
    const nodes = Array.from(panel.childNodes).filter(node => {
      // Element nodes or non-empty text nodes
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim().length > 0);
    });
    if (nodes.length === 1) {
      return nodes[0];
    } else if (nodes.length > 1) {
      return nodes;
    } else {
      // If panel is empty, return empty string
      return '';
    }
  });

  // Build the table cell array: header, tab name row, tab content row
  const cells = [
    headerRow,
    tabNameRow,
    tabContentRow
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabs.replaceWith(table);
}
