/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels and the corresponding tab panels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabLis.map(li => li.textContent.trim());
  const panelIds = tabLis.map(li => li.getAttribute('aria-controls'));

  // Gather tab content in order as DOM references
  const tabContents = panelIds.map(panelId => {
    const panel = tabsBlock.querySelector(`#${panelId}`);
    if (!panel) return document.createTextNode('');
    // If exactly one element child, use it directly
    if (panel.children.length === 1) {
      return panel.firstElementChild;
    } else if (panel.childElementCount > 1) {
      // More than one element child: group in fragment
      const frag = document.createDocumentFragment();
      Array.from(panel.children).forEach(child => frag.appendChild(child));
      return frag;
    } else {
      // fallback: use all childNodes if no element children
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(child => frag.appendChild(child));
      return frag;
    }
  });

  // Build the table structure to match the example:
  // First row: header (one column)
  // Second row: all tab labels as columns
  // Third row: all tab contents as columns
  const cells = [
    ['Tabs (tabs36)'],
    tabLabels,
    tabContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
