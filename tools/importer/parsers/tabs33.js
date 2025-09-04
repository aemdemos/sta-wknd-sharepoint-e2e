/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels and tab panels
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row: must match block name exactly
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Get label text
    const label = labelEl.textContent.trim();
    // Get tab panel content
    const panel = tabPanels[idx];
    // Defensive: Find the main content fragment inside the panel
    let contentFragment = panel.querySelector('.cmp-contentfragment');
    // If not found, fallback to panel itself
    let tabContent = contentFragment || panel;
    // Always reference the existing element, do not clone
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(block);
}
