/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: get the panel, and extract its main content
    const panel = tabPanels[i];
    let content = null;
    // Try to find the .contentfragment inside the panel (if present)
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      content = cf;
    } else {
      // fallback: use the panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the table
  tabsRoot.replaceWith(table);
}
