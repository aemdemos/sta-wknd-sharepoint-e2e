/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements inside the tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panel elements (role=tabpanel with data-cmp-hook-tabs)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: require at least one tab label and one tab panel
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the table header row
  const headerRow = ['Tabs (tabs34)'];

  // ONLY the header row, then one row per tab: [label, content]
  const rows = [headerRow];
  // Each subsequent row: [tab label, tab content]
  const count = Math.min(tabLabels.length, tabPanels.length);
  for (let i = 0; i < count; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Find primary content (usually .contentfragment)
    let content = panel.querySelector('.contentfragment');
    if (!content) {
      // fallback: use non-empty children
      const children = Array.from(panel.childNodes).filter(node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === ''));
      content = children.length === 1 ? children[0] : children;
    }
    rows.push([label, content]);
  }

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
