/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (in order)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels (in order)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Extract tab contents, matching labels order
  const tabContents = tabPanels.map(panel => {
    // Prefer the article.cmp-contentfragment inside the panel
    let frag = panel.querySelector('article.cmp-contentfragment');
    if (frag) return frag;
    frag = panel.querySelector('.contentfragment');
    if (frag) return frag;
    return panel;
  });

  // Table structure:
  // 1st row: single header cell
  // 2nd row: tab labels, one per column
  // 3rd row: tab contents, one per column
  const cells = [
    ['Tabs (tabs18)'],
    tabLabels,
    tabContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
