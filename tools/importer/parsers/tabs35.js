/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs35)'];
  const rows = [headerRow];

  // Get tab labels in order
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure matching number of tabs and panels
  const count = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < count; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // For content, grab all direct children of the tabpanel (should be 1 div.contentfragment)
    // We'll use the whole contentfragment as the content cell for resilience
    let contentCell = null;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      contentCell = cf;
    } else {
      // fallback: use the panel itself
      contentCell = panel;
    }

    rows.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
