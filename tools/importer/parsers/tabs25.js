/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabs = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // Get all tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build table rows
  const rows = [];
  // Header row as specified
  rows.push(['Tabs (tabs25)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: Find corresponding tabpanel by aria-controls/id
    let panel = tabPanels.find(
      p => p.id === tabLabel.getAttribute('aria-controls')
    );
    if (!panel) {
      // fallback: use order
      panel = tabPanels[i];
    }
    // Defensive: get tab label text
    const labelText = tabLabel.textContent.trim();
    // Defensive: get tab content (reference the whole panel)
    rows.push([
      labelText,
      panel ? panel : document.createTextNode('')
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the block table
  tabs.replaceWith(block);
}
