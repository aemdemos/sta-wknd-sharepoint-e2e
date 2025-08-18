/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  let tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) {
    // Fallback if 'cmp-tabs' is not on this element but on a child
    tabsBlock = element.querySelector('[data-cmp-data-layer] .cmp-tabs');
  }
  if (!tabsBlock) return;

  // Get tab labels from <li> in the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get tabpanels: each has data-cmp-hook-tabs="tabpanel" in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose table header row
  const cells = [['Tabs (tabs23)']];

  // For each tab, get [label, content] as row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    // Defensive: some tabs may be missing corresponding panels
    let contentCell = '';
    if (tabPanels[i]) {
      // We want to reference the main content fragment/article inside the panel if present, otherwise the panel itself.
      const fragment = tabPanels[i].querySelector('article.cmp-contentfragment');
      if (fragment) {
        contentCell = fragment;
      } else {
        // If not, use the entire panel content
        contentCell = tabPanels[i];
      }
    }
    cells.push([label, contentCell]);
  }

  // Create the table and replace the original block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
