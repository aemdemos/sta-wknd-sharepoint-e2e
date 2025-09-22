/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the header row
  const headerRow = ['Tabs (tabs14)'];

  // Build the rows for each tab
  const rows = tabLabels.map((labelEl, idx) => {
    // Tab label text
    const label = labelEl.textContent.trim();
    // Tab content: use the whole tabpanel content, but remove aria/role attributes for cleanliness
    const panel = tabPanels[idx];
    // Defensive: if no panel, skip
    if (!panel) return null;
    // Clone the panel content for manipulation
    const panelContent = document.createElement('div');
    // Move all children of the tabpanel into the panelContent div
    Array.from(panel.childNodes).forEach((node) => {
      panelContent.appendChild(node.cloneNode(true));
    });
    // Remove role/aria attributes from panelContent and descendants
    panelContent.removeAttribute('role');
    panelContent.removeAttribute('aria-labelledby');
    panelContent.removeAttribute('tabindex');
    panelContent.removeAttribute('class');
    panelContent.removeAttribute('data-cmp-hook-tabs');
    // Remove aria/role from descendants
    panelContent.querySelectorAll('[role], [aria-labelledby], [tabindex], [data-cmp-hook-tabs], [class]')
      .forEach(el => {
        el.removeAttribute('role');
        el.removeAttribute('aria-labelledby');
        el.removeAttribute('tabindex');
        el.removeAttribute('data-cmp-hook-tabs');
        el.removeAttribute('class');
      });
    return [label, panelContent];
  }).filter(Boolean);

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
