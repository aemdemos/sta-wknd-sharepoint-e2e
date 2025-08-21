/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block in the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tab panels (contents)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Table header: block name exactly as in example
  const headerRow = ['Tabs (tabs38)'];

  // Build each row: [tab label, tab content]
  const rows = tabLabelElements.map((labelEl, idx) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();
    // Find corresponding tab panel by aria-controls attribute
    let tabPanel = null;
    if (labelEl.hasAttribute('aria-controls')) {
      const controlsId = labelEl.getAttribute('aria-controls');
      tabPanel = tabPanels.find(t => t.id === controlsId);
    }
    // Fallback by index if not matched by id
    if (!tabPanel) tabPanel = tabPanels[idx];
    // Defensive: fallback to empty div
    if (!tabPanel) tabPanel = document.createElement('div');
    // Reference the existing tabPanel element
    return [tabLabel, tabPanel];
  });

  // Build the table using the helper
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original block with the table
  tabsRoot.replaceWith(table);
}
