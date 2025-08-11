/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (.cmp-tabs)
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Find tab labels
  const tablist = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tablist ? Array.from(tablist.querySelectorAll('li')).map(li => li.textContent.trim()) : [];
  // Find tabpanels in the same order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Build table: header row, then one row per tab (label, content)
  const rows = [['Tabs (tabs37)']];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let content = '';
    if (tabPanels[i]) {
      // Prefer the <article> contentfragment, otherwise use the whole panel
      const article = tabPanels[i].querySelector('article');
      content = article || tabPanels[i];
    }
    rows.push([label, content]);
  }

  // Create table and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  cmpTabs.parentNode.replaceChild(block, cmpTabs);
}
