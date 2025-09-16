/* global WebImporter */
export default function parse(element, { document }) {
  // Only process elements with .cmp-tabs class
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as required
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // Get tab labels
  const tabLabels = Array.from(
    element.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    element.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only process if counts match
  if (tabLabels.length !== tabPanels.length) return;

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Use the label's text content for the first cell
    // Use the tabpanel's children as the second cell
    let contentCell;
    if (panel.childNodes.length === 1) {
      contentCell = panel.childNodes[0];
    } else {
      contentCell = Array.from(panel.childNodes).filter(node => {
        // Filter out empty text nodes
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
    }
    rows.push([
      label.textContent.trim(),
      contentCell
    ]);
  }

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Remove the original element from its parent and insert the table
  if (element.parentNode) {
    element.parentNode.replaceChild(table, element);
  }
}
