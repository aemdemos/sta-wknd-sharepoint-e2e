/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // 1. Extract tab labels
  const tabLabelElements = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  );
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // 2. Extract tab panels (in order)
  const tabPanelElements = Array.from(
    tabsBlock.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // 3. Compose the rows according to markdown example:
  //    - header row: [ 'Tabs (tabs36)' ]
  //    - second row: [label1, label2, ...]
  //    - then for each tab: [label, content]
  const cells = [];
  cells.push(['Tabs (tabs36)']);
  cells.push(tabLabels);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanelElements[i];
    // Try to find the main content (prefer article, fallback to entire panel)
    let contentEl = panel.querySelector('article');
    if (!contentEl) {
      if (panel.children.length === 1) {
        contentEl = panel.children[0];
      } else {
        contentEl = panel;
      }
    }
    cells.push([label, contentEl]);
  }

  // 4. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
