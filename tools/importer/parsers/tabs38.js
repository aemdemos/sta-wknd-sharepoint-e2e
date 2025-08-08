/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return; // Defensive: only process if tabs block found

  // Extract tab labels from the tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Extract tab panels by order of appearance
  const tabPanels = tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  // Header row: the block name/variant
  const rows = [['Tabs (tabs38)']];

  // For each tab, create a row: [Label, Content]
  tabLabels.forEach((label, idx) => {
    let contentCell;
    const panel = tabPanels[idx];
    if (panel) {
      // Find the actual tab content
      // If there is a contentfragment, use its children
      const contentFragment = panel.querySelector('.cmp-contentfragment');
      if (contentFragment) {
        // Get everything inside the contentfragment (preserving heading, lists, images, etc.)
        // Reference all children, not clone
        // Remove empty text nodes
        const children = Array.from(contentFragment.childNodes).filter(
          (node) => !(node.nodeType === 3 && !node.textContent.trim()) // skip empty text nodes
        );
        contentCell = children.length > 1 ? children : children[0];
      } else {
        // If no contentfragment, use all children of panel
        const children = Array.from(panel.childNodes).filter(
          (node) => !(node.nodeType === 3 && !node.textContent.trim())
        );
        contentCell = children.length > 1 ? children : children[0];
      }
      // If still empty, fallback to empty string
      if (!contentCell) contentCell = '';
    } else {
      contentCell = '';
    }
    rows.push([label, contentCell]);
  });

  // Create and insert the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
