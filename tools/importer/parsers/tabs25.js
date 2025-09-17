/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the tabs block)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements in the tablist)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panels (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: If no labels or panels, don't proceed
  if (!tabLabels.length || !tabPanels.length) return;

  // Header row as required
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  // For each tab, find its label and corresponding panel
  tabLabels.forEach((tabLabel, idx) => {
    // Get the label text
    const label = tabLabel.textContent.trim();

    // Find the corresponding panel by aria-controls/id
    let panel;
    const ariaControls = tabLabel.getAttribute('aria-controls');
    if (ariaControls) {
      panel = tabs.querySelector(`#${ariaControls}`);
    } else {
      // fallback: use index
      panel = tabPanels[idx];
    }
    if (!panel) return;

    // The content for the tab is the entire tabpanel div
    // (this includes images, text, etc. as seen in the HTML)
    rows.push([label, panel]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
