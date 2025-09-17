/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element
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

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows: header first
  const rows = [
    ['Tabs (tabs3)']
  ];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: If panel is empty, skip
    if (!panel) continue;

    // For content, get everything inside the tabpanel
    // We'll use the first child if it's a wrapper, else the panel itself
    let contentEl = null;
    // Usually the content is a single .contentfragment or similar
    if (panel.children.length === 1) {
      contentEl = panel.firstElementChild;
    } else {
      // fallback: use the panel itself
      contentEl = panel;
    }

    // Defensive: If contentEl is empty, skip
    if (!contentEl) continue;

    rows.push([
      label,
      contentEl
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
