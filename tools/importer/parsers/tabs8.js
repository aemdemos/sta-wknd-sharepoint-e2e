/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container by class
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Header row for the block table
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  // Get all tab labels (li elements inside the tablist)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only process as many panels as there are labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Tab label text
    const tabLabelText = label.textContent.trim();

    // Tab content: get all children of the tabpanel
    // Defensive: If the panel has only one child (e.g., .contentfragment), use that
    let tabContent;
    if (panel.children.length === 1) {
      tabContent = panel.children[0];
    } else {
      // Otherwise, use the whole panel
      tabContent = panel;
    }

    // Add the row: [Tab Label, Tab Content]
    rows.push([tabLabelText, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the new block table
  tabs.replaceWith(block);
}
