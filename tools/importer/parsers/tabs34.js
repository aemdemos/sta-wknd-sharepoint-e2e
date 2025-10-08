/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only keep as many panels as we have labels (should match)
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs34)']);

  for (let i = 0; i < tabCount; i++) {
    // Tab label
    const label = tabLabels[i];
    // Tab content: get the panel's content as a single element
    const panel = tabPanels[i];
    // Defensive: If the panel is empty, just use an empty div
    let content;
    if (panel && panel.childNodes.length > 0) {
      // For resilience, wrap the panel's children in a div
      const wrapper = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => wrapper.appendChild(node.cloneNode(true)));
      content = wrapper;
    } else {
      content = document.createElement('div');
    }
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(table);
}
