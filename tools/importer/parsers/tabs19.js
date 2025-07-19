/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels from the tablist (these are <li> elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // Get all tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // If no tabs or no panels, do not proceed
  if (!tabLabels.length || !tabPanels.length) return;

  // Build the table header row (one cell)
  const headerRow = ['Tabs (tabs19)'];

  // Build the tab rows: one row per tab, [label, content]
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Prefer the main article/contentfragment in this panel
      const mainContent = panel.querySelector('article, .contentfragment');
      if (mainContent) {
        content = mainContent;
      } else {
        // Fallback to all children
        const els = Array.from(panel.children);
        content = els.length ? els : panel;
      }
    } else {
      content = '';
    }
    tabRows.push([label, content]);
  }

  const rows = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(block);
}
