/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process if we have labels and matching panels
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab content: use the entire tab panel element
    const panel = tabPanels[i];
    // Defensive: If panel is missing, skip
    if (!panel) return;
    // For resilience, reference the panel's content fragment if present
    let content = null;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      content = cf;
    } else {
      // Fallback: use the panel itself
      content = panel;
    }
    rows.push([labelText, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsContainer with the block
  tabsContainer.replaceWith(block);
}
