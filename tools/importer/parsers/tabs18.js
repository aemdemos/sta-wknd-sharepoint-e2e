/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (usually <li> elements)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab (label, content)
  const rows = [];
  rows.push(['Tabs (tabs18)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: clone the panel content to avoid moving it in the DOM
    const panelContent = document.createElement('div');
    // Move all children of the tabpanel into the wrapper
    Array.from(panel.childNodes).forEach(node => {
      panelContent.appendChild(node.cloneNode(true));
    });
    rows.push([label, panelContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the block
  tabs.replaceWith(block);
}
