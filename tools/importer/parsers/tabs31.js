/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels
  const tablist = tabs.querySelector('[role="tablist"]');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get the tab panels (tab content) - panels are in DOM order and correspond to tabLabels order
  const tabPanels = tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // For each panel, extract its content as an array of child nodes, preserving all structure
  // The block header
  const rows = [['Tabs (tabs31)']];
  
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;

    // The content is typically a .contentfragment, but we should capture everything under the panel
    // We'll collect all Element and non-empty Text nodes (in case of stray text)
    const cellNodes = [];
    Array.from(panel.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        cellNodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        // Text node with actual content
        cellNodes.push(document.createTextNode(node.textContent));
      }
    });
    rows.push([label, cellNodes.length === 1 ? cellNodes[0] : cellNodes]);
  });

  // Assemble block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
