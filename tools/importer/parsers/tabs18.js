/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelNodes = tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : [];

  // Get all tab panels in order
  const tabPanelNodes = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // The header row should have two columns to match the tab label/content rows
  const headerRow = ['Tabs (tabs18)', ''];
  const cells = [headerRow];

  // Build tab rows: each row is [label, content]
  for (let i = 0; i < tabLabelNodes.length; i++) {
    const label = tabLabelNodes[i]?.textContent.trim() || '';
    const panel = tabPanelNodes[i];
    let contentEl = null;
    if (panel) {
      // Find the first contentfragment article (if any)
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        // Remove the h3.cmp-contentfragment__title if present (to match tabs pattern, no repeated tab heading)
        const possibleTitle = contentFragment.querySelector('h3.cmp-contentfragment__title');
        if (possibleTitle && possibleTitle.parentNode === contentFragment) {
          possibleTitle.remove();
        }
        // Remove empty .aem-Grid blocks at the top level inside contentfragment
        contentFragment.querySelectorAll('.aem-Grid').forEach(grid => {
          if (!grid.textContent.trim()) grid.remove();
        });
        contentEl = contentFragment;
      } else {
        // fallback: use all children of the panel
        const fragment = document.createElement('div');
        Array.from(panel.childNodes).forEach(n => fragment.appendChild(n));
        contentEl = fragment;
      }
    }
    cells.push([label, contentEl]);
  }

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block in the DOM
  tabsBlock.replaceWith(table);
}
