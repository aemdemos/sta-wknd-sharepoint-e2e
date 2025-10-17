/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels and panels
  const tabList = tabsRoot.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());
  const tabPanels = Array.from(tabsRoot.querySelectorAll('div[role="tabpanel"]'));
  if (!tabLabels.length || !tabPanels.length) return;

  // Build rows: first row is header
  const rows = [];
  rows.push(['Tabs (tabs31)']);

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;
    let tabContent = null;
    const fragment = panel.querySelector('.cmp-contentfragment');
    tabContent = fragment ? fragment : panel;
    rows.push([label, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
