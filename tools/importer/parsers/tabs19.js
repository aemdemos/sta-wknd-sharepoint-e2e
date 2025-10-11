/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements inside tablist)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (by class and data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: match tabLabels and tabPanels by order
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Use the label text for the first cell
    // For the content, use the full panel content (reference, not clone)
    rows.push([
      label.textContent.trim(),
      panel
    ]);
  }

  // Table header row
  const headerRow = ['Tabs (tabs19)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
