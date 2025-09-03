/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // Tab labels
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > li'));
  // Tab panels
  const tabPanels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: match labels and panels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!panel) continue;

    // Get all content inside the panel (not just .contentfragment)
    // This ensures all text and elements are included
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      // Filter out empty text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      // Filter out empty grid wrappers
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('aem-Grid') && node.children.length === 0) return false;
      return true;
    });

    // If only one node, use it directly; else, use array
    const tabContent = contentNodes.length === 1 ? contentNodes[0] : contentNodes;

    rows.push([label, tabContent]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
