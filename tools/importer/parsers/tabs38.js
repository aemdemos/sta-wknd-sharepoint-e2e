/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container. The matching block is the .cmp-tabs inside a .tabs container
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract all tab labels from the tablist (ol > li)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Extract all tab panels (tab content containers)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare header row: block name, per requirements
  const rows = [
    ['Tabs (tabs38)']
  ];

  // Each subsequent row is [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] ? tabLabels[i].textContent.trim() : '';
    let content = '';
    // Panel content - include all child nodes (preserve references as much as possible)
    if (tabPanels[i]) {
      // If the panel has only one child, use it directly
      if (tabPanels[i].children.length === 1) {
        content = tabPanels[i].children[0];
      } else if (tabPanels[i].children.length > 1) {
        // If multiple children, use array
        content = Array.from(tabPanels[i].children);
      } else {
        // If no children, but there is textContent, fallback to panel itself
        content = tabPanels[i];
      }
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
