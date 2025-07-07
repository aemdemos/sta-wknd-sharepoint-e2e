/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find all tab labels (li's in the tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('li'));

  // Find all tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Build cells: first row is the header, matches the example exactly
  const cells = [['Tabs (tabs10)']];

  tabLis.forEach((li) => {
    // Tab label (left cell)
    const tabLabel = li.textContent.trim();
    // Find tab panel by aria-controls
    const panelId = li.getAttribute('aria-controls');
    let panel = null;
    if (panelId) {
      panel = tabsBlock.querySelector(`#${panelId}`);
    }
    // Defensive: skip if no panel
    if (!panel) return;

    // The main content to show for this tab
    // Often it's a contentfragment/article, else use the tab panel itself
    let tabContent = null;
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      tabContent = panel;
    }
    // Push row: label and existing element as content
    cells.push([tabLabel, tabContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
