/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the supplied element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find tab labels (li elements) and tab panels (divs with data-cmp-hook-tabs="tabpanel")
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  );
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build header row: block name
  const headerRow = ['Tabs (tabs19)']; // Matches example header exactly

  // Build each tab row as [label, content] per example structure
  const tabRows = [];
  for (let i = 0; i < Math.min(tabLabels.length, tabPanels.length); i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // For each tab panel, use the .contentfragment if present, otherwise the panel itself
    let content;
    const contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      content = panel;
    }
    tabRows.push([label, content]);
  }

  // Compose the table: header row, then one row per tab (label, content)
  const cells = [headerRow, ...tabRows];

  // Create and replace table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
