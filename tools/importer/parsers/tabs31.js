/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (li elements under ol.cmp-tabs__tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children) : [];

  // Get the tab panel elements (div[data-cmp-hook-tabs="tabpanel"] in order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Create the header row as required
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // Map each tab label to its corresponding tab content
  tabLabels.forEach((tabLabel, idx) => {
    const labelText = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    if (!panel) return; // skip if missing panel for tab
    // Extract inner content nodes for the panel (keep structure)
    // If there's only one child (eg. .contentfragment), use that directly, else use all children
    let contentNodes = [];
    if (panel.children.length === 1) {
      contentNodes.push(panel.children[0]);
    } else if (panel.children.length > 1) {
      contentNodes = Array.from(panel.children);
    } else {
      // fallback: include all childNodes (for text nodes and elements)
      contentNodes = Array.from(panel.childNodes).filter(node => node.nodeType !== Node.COMMENT_NODE && (node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== ''));
      // If still empty, as last fallback, include the panel itself
      if (contentNodes.length === 0) contentNodes = [panel];
    }
    rows.push([labelText, contentNodes]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs with the new block
  tabs.replaceWith(block);
}
