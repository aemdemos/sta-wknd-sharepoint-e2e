/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element;

  // Header row for the block table
  const headerRow = ['Tabs (tabs23)'];

  // Find tab labels (li elements inside ol[role="tablist"])
  const tabList = tabsRoot.querySelector('ol[role="tablist"]');
  const tabLabels = Array.from(tabList ? tabList.children : []);

  // Find tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: If no tabs, do nothing
  if (!tabLabels.length || !tabPanels.length) return;

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel, idx) => {
    // Tab label text
    const label = tabLabel.textContent.trim();

    // Find the corresponding tabpanel by aria-controls/id
    // Defensive: Try to match by aria-controls
    let panel = tabPanels.find(
      p => p.id === tabLabel.getAttribute('aria-controls')
    );
    // Fallback: use index if not found
    if (!panel) panel = tabPanels[idx];

    // Defensive: If no panel, just use label
    if (!panel) return [label, ''];

    // Tab content: reference the entire tabpanel content
    // If the tabpanel contains a single .contentfragment, use that
    const contentFragment = panel.querySelector('.contentfragment') || panel;

    return [label, contentFragment];
  });

  // Compose the table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new block table
  tabsRoot.replaceWith(block);
}
