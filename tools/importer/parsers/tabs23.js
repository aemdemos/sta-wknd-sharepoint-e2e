/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: header first (block name must match exactly)
  const cells = [ ['Tabs (tabs23)'] ];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    const labelText = tabLabel.textContent.trim();
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Use the whole panel content (preserves structure)
      // If panel has only one child, use that child (usually a contentfragment)
      if (panel.children.length === 1) {
        content = panel.children[0];
      } else {
        // If not, use the panel itself
        content = panel;
      }
    } else {
      // Defensive: if no panel, use empty text node
      content = document.createTextNode('');
    }
    cells.push([labelText, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
