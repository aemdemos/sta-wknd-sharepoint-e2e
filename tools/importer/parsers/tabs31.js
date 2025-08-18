/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root (AEM tabs component)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels in order
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build table rows
  const rows = [];
  // Block header row
  rows.push(['Tabs (tabs31)']);

  // Each tab label and its content (referencing the highest-level content container per tab)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    const panel = tabPanels[i];
    if (!panel) continue;
    // Find the primary content div for the tab (cmp-contentfragment, .contentfragment, or fallback to panel)
    let content = panel.querySelector('article.cmp-contentfragment')
      || panel.querySelector('.contentfragment')
      || panel.querySelector('.cmp-contentfragment')
      || panel;
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
