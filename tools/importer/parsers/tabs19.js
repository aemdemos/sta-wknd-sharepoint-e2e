/* global WebImporter */
export default function parse(element, { document }) {
  // Only extract tabs block as rows: [tab label, tab content]
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Build rows for each tab
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const tabLabel = labelEl.textContent.trim();
    const panelId = labelEl.getAttribute('aria-controls');
    const panelEl = cmpTabs.querySelector(`#${panelId}`);
    if (!panelEl) continue;
    // Try to find the main contentfragment/article
    let tabContent;
    const cf = panelEl.querySelector('article.cmp-contentfragment');
    if (cf) {
      tabContent = cf.cloneNode(true);
    } else {
      tabContent = document.createElement('div');
      Array.from(panelEl.childNodes).forEach((n) => tabContent.appendChild(n.cloneNode(true)));
    }
    rows.push([tabLabel, tabContent]);
  }

  // Table header
  const headerRow = ['Tabs (tabs19)'];
  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
