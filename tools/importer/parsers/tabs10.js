/* global WebImporter */
export default function parse(element, { document }) {
  // Only proceed if this is a tabs block
  if (!element.classList.contains('tabs') && !element.classList.contains('panelcontainer')) return;

  // Find the cmp-tabs element inside this block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];

  // For each tab, add a row: [Label, Content]
  tabLabels.forEach((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[idx];
    // Defensive: If panel is missing, skip
    if (!panel) return;
    // Use the full panel element as content
    rows.push([label, [panel]]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block table
  tabsRoot.replaceWith(block);
}
