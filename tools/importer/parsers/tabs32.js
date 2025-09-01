/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels (li in .cmp-tabs__tablist)
  const tabLabelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  if (!tabLabelEls.length) return;

  // Find tab panels ('.cmp-tabs__tabpanel')
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  if (!tabPanels.length) return;

  // Build the header row: block name, single cell
  const headerRow = ['Tabs (tabs32)'];

  // Second row: all tab labels, one per column (strong for bold tab label)
  const labelRow = tabLabelEls.map(li => {
    const strong = document.createElement('strong');
    strong.textContent = li.textContent.trim();
    return strong;
  });

  // Third row: all tab content, one per column (reference the main article or content in panel)
  const contentRow = tabPanels.map(panel => {
    // Use the main contentfragment/article inside each panel, if present
    const article = panel.querySelector('article');
    if (article) return article;
    const cf = panel.querySelector('.contentfragment');
    if (cf) return cf;
    return panel;
  });

  // Compose the table: [header], [tab labels as columns], [tab content as columns]
  const cells = [headerRow, labelRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
