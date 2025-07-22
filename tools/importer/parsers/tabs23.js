/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the input element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels (li elements inside the tablist)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panels (divs with cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Compose the table: header row, then one row per tab: [label, content]
  const cells = [['Tabs (tabs23)']];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    let content = '';
    const panelEl = tabPanels[i];
    if (panelEl) {
      const article = panelEl.querySelector('article');
      if (article) {
        content = article;
      } else {
        // fallback: include all children except empty .aem-Grid
        const nodes = Array.from(panelEl.childNodes).filter(
          node => !(node.nodeType === 1 && node.matches('.aem-Grid')) &&
                   !(node.nodeType === 3 && node.textContent.trim() === '')
        );
        content = nodes.length === 1 ? nodes[0] : nodes;
      }
    }
    cells.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsContainer with the new table
  tabsContainer.parentNode.replaceChild(table, tabsContainer);
}
