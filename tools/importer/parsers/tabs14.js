/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li under ol.cmp-tabs__tablist)
  const tabList = tabsBlock.querySelector('ol.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.children);

  // For each tab label, get the visible label and its associated panel
  const rows = [];
  // Header row as in the example
  rows.push(['Tabs (tabs14)']);

  // For each tab label/li
  tabLabelEls.forEach((li) => {
    const label = li.textContent.trim();
    // aria-controls points to tabpanel id
    const panelId = li.getAttribute('aria-controls');
    if (!panelId) return;
    const panel = tabsBlock.querySelector(`#${panelId}`);
    if (!panel) return;
    // Content: reference the entire contentfragment > article within the tabpanel
    let tabContent = null;
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      tabContent = article;
    } else {
      // fallback: use the whole panel if article/cmp-contentfragment is not present
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create the table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
