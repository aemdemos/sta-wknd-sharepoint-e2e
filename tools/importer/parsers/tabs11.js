/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (should be the cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li.cmp-tabs__tab)
  const tabLabelEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  const tabLabels = tabLabelEls.map(el => el.textContent.trim());

  // Find all tab panels (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Edge case: if number of panels doesn't match tab labels, only pair up to shortest
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  const rows = [];
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Prefer a single main block for content (e.g. article.cmp-contentfragment), else all children
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        contentCell = contentFragment;
      } else {
        // If there are children, add them all; else fallback to panel itself
        if (panel.children.length > 0) {
          contentCell = Array.from(panel.children);
        } else {
          contentCell = panel;
        }
      }
    }
    rows.push([label, contentCell]);
  }

  // Table header row from the block name (per spec)
  const tableCells = [
    ['Tabs (tabs11)'],
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
