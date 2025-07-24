/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the given element (should be the tabs panelcontainer)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Prepare the table header row as specified
  const headerRow = ['Tabs (tabs33)'];
  const cells = [headerRow];

  // Get all tab labels and corresponding panels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // The tabpanels are not always in order, so we use aria-controls to link them
  
  for (const tabLabelEl of tabLabels) {
    const label = tabLabelEl.textContent.trim();
    const panelId = tabLabelEl.getAttribute('aria-controls');
    const panel = tabs.querySelector(`#${panelId}`);
    if (!panel) continue;
    // Reference the original panel element directly for content (preserves elements, images, etc.)
    cells.push([label, panel]);
  }

  // Create the block table for tabs
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs panelcontainer element with the block
  element.replaceWith(block);
}
