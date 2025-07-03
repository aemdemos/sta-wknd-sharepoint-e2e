/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels in order - some panels may have aria-hidden true, but keep all
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the table block: header row must be ['Tabs (tabs16)']
  const cells = [
    ['Tabs (tabs16)']
  ];

  // Each subsequent row is: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const labelText = label ? label.textContent.trim() : '';
    // Find corresponding panel (by index, as in original DOM)
    let panel = tabPanels[i];
    let tabContent;
    if (panel) {
      // For tab content: use only the actual content children (avoid copying the outer tabpanel div)
      // We'll collect all child nodes into an array and reference them directly
      const contentNodes = Array.from(panel.childNodes).filter(node => {
        // Only append element nodes or non-empty text nodes
        return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
      });
      // If only one node, put it directly, else array of nodes (to retain structure)
      if (contentNodes.length === 1) {
        tabContent = contentNodes[0];
      } else if (contentNodes.length > 1) {
        tabContent = contentNodes;
      } else {
        tabContent = '';
      }
    } else {
      tabContent = '';
    }
    cells.push([labelText, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table
  tabs.replaceWith(block);
}
