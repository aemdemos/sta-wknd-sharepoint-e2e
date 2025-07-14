/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab headers (tab titles)
  const tabHeaderEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all panels (tab contents)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: skip if no matching tabs or panels
  if (!tabHeaderEls.length || !tabPanels.length) return;

  // Compose block header row (block name)
  const headerRow = ['Tabs (tabs9)'];

  // Compose rows: each [tab label, tab content]
  const rows = tabPanels.map((panel, i) => {
    // Tab label: from headers list, fallback to empty string if not found
    const tabLabel = tabHeaderEls[i]?.textContent.trim() || '';

    // Tab content: reference the first main content child, else reference panel
    // We want to preserve the structure, so prefer the direct .contentfragment if present
    let mainContent = null;
    // Prefer the first .contentfragment
    mainContent = panel.querySelector('.contentfragment');
    if (!mainContent) {
      // Fallback: use the panel itself
      mainContent = panel;
    }
    // Reference the existing element, don't clone
    return [tabLabel, mainContent];
  });

  // Compose table array
  const table = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(table, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
