/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the passed element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(li => li.textContent.trim());

  // Extract tab panels (should match tab labels order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  const nTabs = Math.min(tabLabels.length, tabPanels.length);
  const labels = tabLabels.slice(0, nTabs);

  // For content: use first article if available, else panel
  const contents = [];
  for (let i = 0; i < nTabs; i++) {
    const panel = tabPanels[i];
    let content = null;
    const article = panel.querySelector('article');
    content = article ? article : panel;
    contents.push(content);
  }

  // Build the correct table structure:
  // [ [header], [tab labels...], [tab contents...] ]
  const rows = [];
  rows.push(['Tabs (tabs7)']);
  rows.push(labels);
  rows.push(contents);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
