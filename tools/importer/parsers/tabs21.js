/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs21)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Get the label text
    const label = labelEl.textContent.trim();
    // Find the associated panel by aria-controls
    let panel = tabPanels.find(
      p => p.id === labelEl.getAttribute('aria-controls')
    );
    if (!panel) {
      // fallback: use index
      panel = tabPanels[idx];
    }
    if (!panel) return;

    // For tab content, reference the entire tabpanel content
    // Find the main content fragment/article inside the panel
    let tabContent = panel.querySelector('article') || panel;
    if (!tabContent) return;

    rows.push([label, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabs.replaceWith(block);
}
