/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the current element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (exact order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  if (!tabLabels.length || !tabPanels.length) return;

  // Defensive: Only keep as many panels as labels (should always match, but just in case)
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Header row
  const rows = [['Tabs (tabs32)']];

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < count; i++) {
    // Tab label as plain text
    const label = tabLabels[i].textContent.trim();
    // The tabpanel's content - reference its children, but wrap in a container for robustness
    const panel = tabPanels[i];
    // Create a container and move all children into it from the current document
    const div = document.createElement('div');
    // Only bring over element nodes and non-empty text nodes
    Array.from(panel.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim().length) {
          div.appendChild(node);
        }
      } else {
        div.appendChild(node);
      }
    });
    rows.push([label, div]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block only
  tabs.replaceWith(table);
}