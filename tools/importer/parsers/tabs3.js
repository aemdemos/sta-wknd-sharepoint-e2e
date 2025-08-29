/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (order must match labels)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs3)']);

  // For each tab, create a row: label (first cell), tab content (second cell)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Grab the main contentfragment within the panel (usually the article)
      const cf = panel.querySelector('.contentfragment');
      if (cf) {
        content = cf;
      } else {
        // fallback: reference the panel itself
        content = panel;
      }
    } else {
      // If panel missing, just use empty string
      content = '';
    }
    rows.push([label, content]);
  }

  // Create the table and replace the original tabs element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
