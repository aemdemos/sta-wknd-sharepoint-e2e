/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim()) : [];

  // Extract corresponding tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build table: header, then [tab label, tab content] for each tab
  const rows = [['Tabs (tabs30)']];
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    let content = null;
    if (panel) {
      // Prefer .cmp-contentfragment__elements if present
      content = panel.querySelector('.cmp-contentfragment__elements');
      if (!content) {
        const article = panel.querySelector('article');
        content = article || panel;
      }
    }
    rows.push([label, content]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
