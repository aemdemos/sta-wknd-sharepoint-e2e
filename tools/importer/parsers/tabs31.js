/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Grab all tab labels in order
  const tabLabelElements = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));

  // Each tabpanel has role=tabpanel
  const tabPanelElements = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Block table header as per spec
  const rows = [['Tabs (tabs31)']];

  // For each tab/tabpanel
  tabLabelElements.forEach((tabEl) => {
    // Extract label text
    const label = tabEl.textContent.trim();
    // Find the associated panel by aria-controls
    const panelId = tabEl.getAttribute('aria-controls');
    const panel = panelId ? tabs.querySelector(`#${panelId}`) : null;
    // Defensive: If not found, fallback to order
    let tabContent = panel;
    // Try to get direct content (the main content div inside tabpanel)
    if (tabContent && tabContent.children.length === 1 && tabContent.firstElementChild) {
      // If only one child (e.g. <div class="contentfragment">), use that
      tabContent = tabContent.firstElementChild;
    }
    // Add row to table
    rows.push([
      label,
      tabContent || ''
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
