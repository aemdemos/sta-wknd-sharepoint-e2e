/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Gather all tab label elements in order
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist li[role="tab"]'));
  // Gather all tab panel elements in order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the header row exactly as required
  const headerRow = ['Tabs (tabs13)'];

  // For each tab, extract the label and corresponding content
  const rows = tabLabels.map((tabLabel, idx) => {
    // Tab name (cleaned up)
    const tabName = tabLabel.textContent.trim();
    let tabContent = '';
    // Try to get the corresponding tab panel by index
    const panel = tabPanels[idx];
    if (panel) {
      // We want the main content inside the tabpanel (not the tabpanel div itself)
      // Usually, all meaningful content is inside a single child (e.g., .contentfragment)
      // We'll gather all meaningful children (skip empty whitespace/textnodes)
      const meaningfulNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      // If one meaningful child, use it directly. If more, use array.
      if (meaningfulNodes.length === 1) {
        tabContent = meaningfulNodes[0];
      } else if (meaningfulNodes.length > 1) {
        tabContent = meaningfulNodes;
      } else {
        tabContent = '';
      }
    }
    return [tabName, tabContent];
  });

  // Assemble the cells for the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the structured table
  element.replaceWith(table);
}
