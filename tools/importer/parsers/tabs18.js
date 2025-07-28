/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block containing .cmp-tabs
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the list
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (same order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build header row
  const headerRow = ['Tabs (tabs18)'];
  const cells = [headerRow];

  for (let i = 0; i < tabLabelElements.length; i++) {
    const labelEl = tabLabelElements[i];
    // Defensive: skip if missing label or panel
    if (!labelEl || !tabPanels[i]) continue;
    const label = labelEl.textContent.trim();
    const panel = tabPanels[i];
    // For the "content" of the tab: reference ALL direct children of the .cmp-tabs__tabpanel.
    // But, if the panel has a single <div class="contentfragment"> with a single <article>, just reference the article for semantic clarity.
    let contentEl;
    const contentFragment = panel.querySelector('.contentfragment');
    if (
      contentFragment &&
      contentFragment.children.length === 1 &&
      contentFragment.children[0].tagName.toLowerCase() === 'article'
    ) {
      contentEl = contentFragment.children[0];
    } else {
      // Otherwise, gather all direct children of the panel except script/style
      const kids = Array.from(panel.children).filter(
        (kid) => kid.tagName.toLowerCase() !== 'script' && kid.tagName.toLowerCase() !== 'style'
      );
      contentEl = kids.length === 1 ? kids[0] : kids;
    }
    cells.push([label, contentEl]);
  }

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsContainer.replaceWith(table);
}
