/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabNodes = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabNodes.map((tab) => tab.textContent.trim());

  // Get tab panels in DOM order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose table: header row (block name), then one row per tab (label, content)
  const rows = [ [ 'Tabs (tabs7)' ] ];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // Prefer the main article if present
      const article = panel.querySelector('article');
      if (article) {
        contentCell = article;
      } else {
        // Else, all children (except empty text nodes)
        const nodes = Array.from(panel.childNodes).filter(n => {
          if (n.nodeType === Node.TEXT_NODE) {
            return n.textContent.trim().length > 0;
          }
          return true;
        });
        contentCell = nodes.length === 1 ? nodes[0] : nodes;
      }
    } else {
      // Panel missing: empty div
      contentCell = document.createElement('div');
    }
    rows.push([label, contentCell]);
  }

  // Create block table and replace the original tabs element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
