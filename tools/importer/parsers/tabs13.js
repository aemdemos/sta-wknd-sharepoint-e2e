/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from tablist
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];
  // Defensive: Only include tab labels and their contents if both exist
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Get tab panels (content) in the same order
  const tabPanelEls = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Compose the table rows, first row is header (block name exactly as example)
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    // Defensive: in case panels and labels get out of sync
    let content = '';
    if (tabPanelEls[i]) {
      // Prefer to use the contentfragment article inside the tabpanel
      const contentFragment = tabPanelEls[i].querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        content = contentFragment;
      } else {
        // If no contentfragment, use all children of panel (for resiliency)
        const children = Array.from(tabPanelEls[i].children);
        if (children.length > 0) {
          content = children;
        } else {
          // Fallback: use the entire panel
          content = tabPanelEls[i];
        }
      }
    }
    rows.push([label, content]);
  }

  // Only create the block if there is at least one tab row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
