/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: first row is always the block name
  const rows = [
    ['Tabs (tabs34)']
  ];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the panel content to avoid moving it from DOM
    const panelContent = document.createElement('div');
    // Only include the direct children of the tabpanel (skip the tabpanel wrapper)
    Array.from(panel.childNodes).forEach(node => {
      // Only append element or text nodes (skip comments)
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        panelContent.appendChild(node.cloneNode(true));
      }
    });

    rows.push([
      label,
      panelContent
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the new block table
  tabs.replaceWith(block);
}
