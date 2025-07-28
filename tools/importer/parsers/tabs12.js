/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root. It has class 'cmp-tabs'.
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels (li elements under tablist)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  // Get list items in tab order
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Find all tab panels (div[role=tabpanel] with data-cmp-hook-tabs="tabpanel") in DOM order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure matching count of tabs/labels
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Build the table header
  const headerRow = ['Tabs (tabs12)'];

  // Build label row - tab label text only (not the tab LI element itself for simplicity)
  const labelRow = tabLabels.map(label => label.textContent.trim());

  // For each panel, gather the relevant content:
  //   - if it has a direct child <article>, use that
  //   - otherwise, use all children (as array) unless empty, fallback to ''
  const contentRow = tabPanels.map(panel => {
    // Prefer existing semantic article (primary content of tab)
    const article = panel.querySelector('article');
    if (article) return article;
    // Otherwise, gather all children (to preserve structure)
    const children = Array.from(panel.children).filter(n => n && (n.textContent.trim() || n.querySelector('*')));
    if (children.length > 0) return children;
    // Fallback: empty string
    return '';
  });

  // Final table: header row, label row, content row
  const cells = [
    headerRow,
    labelRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabsRoot element with the block table
  tabsRoot.replaceWith(block);
}
