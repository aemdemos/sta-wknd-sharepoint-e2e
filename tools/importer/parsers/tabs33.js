/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels and corresponding tab panels
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Table header must match block name exactly
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, i) => {
    const panel = tabPanels[i];
    if (!panel) return;
    const labelText = tabLabel.textContent.trim();
    // Reference the actual tab panel content (not clone)
    // Prefer the main contentfragment/article inside the panel, else the panel itself
    let tabContent = panel.querySelector('article') || panel;
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsRoot.parentNode.replaceChild(block, tabsRoot);
}
