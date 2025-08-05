/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab label nodes and panels in order
  const tabNodes = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  const tabLabels = tabNodes.map(tab => tab.textContent.trim());
  const tabPanels = tabNodes.map(tab => {
    const panelId = tab.getAttribute('aria-controls');
    return tabsBlock.querySelector(`#${panelId}`);
  });

  // Create the table: header row is a single cell with block name
  const cells = [['Tabs (tabs39)']];
  // Each tab gets its own row: [label, panel content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Prefer article element if present, else all children
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        content = Array.from(panel.childNodes);
      }
    } else {
      content = '';
    }
    cells.push([label, content]);
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
