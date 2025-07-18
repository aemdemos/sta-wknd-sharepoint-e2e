/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block in the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels in order
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll(':scope > .cmp-tabs__tablist > .cmp-tabs__tab')
  );
  // Fallback if direct children doesn't work
  let labels;
  if (tabLabels.length === 0) {
    labels = Array.from(
      tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
    );
  } else {
    labels = tabLabels;
  }

  // Find panels in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll(':scope > [role="tabpanel"]')
  );
  // Fallback for panel lookup
  let panels = tabPanels;
  if (tabPanels.length === 0) {
    panels = Array.from(
      tabsBlock.querySelectorAll('div[role="tabpanel"]')
    );
  }

  // Prepare rows
  const rows = [
    ['Tabs (tabs30)']
  ];

  // For each tab, add a row [label, content]
  for (let i = 0; i < labels.length; i++) {
    const labelText = labels[i]?.textContent?.trim() || '';
    const panel = panels[i];
    let content = '';
    if (panel) {
      // Per structure, panel > .contentfragment (contains the full rich tab content)
      const cf = panel.querySelector('.contentfragment');
      if (cf) {
        content = cf;
      } else {
        // Fallback: use panel content itself
        content = panel;
      }
    }
    rows.push([labelText, content]);
  }

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
