/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels from the tab list (these are <li> inside .cmp-tabs__tablist)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the rows for the table
  const rows = [];
  // Header row - single cell
  rows.push(['Tabs (tabs20)']);

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i].textContent.trim();
    // Find the corresponding tabpanel for this tab by aria-controls/id
    let contentEl = null;
    const controlsId = tabLabelEls[i].getAttribute('aria-controls');
    if (controlsId) {
      contentEl = tabsContainer.querySelector(`#${controlsId}`);
    }
    // fallback to positional if not found
    if (!contentEl && tabPanels[i]) contentEl = tabPanels[i];
    // fallback to empty div
    if (!contentEl) contentEl = document.createElement('div');
    rows.push([
      label,
      contentEl
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(table);
}
