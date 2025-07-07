/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim()) : [];

  // Extract tab panel content in DOM order (as they appear in the HTML)
  const allPanels = tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  const tabPanels = tabLabels.map((_, i) => allPanels[i] || null);

  // Build header: first row is a single cell
  const rows = [ ['Tabs (tabs32)'] ];
  // All subsequent rows have two cells: label, content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      const cf = panel.querySelector('article.cmp-contentfragment');
      contentCell = cf ? cf : panel;
    }
    rows.push([label, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
