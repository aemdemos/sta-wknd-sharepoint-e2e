/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element;

  // Header row for the block table
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  // Find tab labels (li elements inside ol[role=tablist])
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('ol[role="tablist"] > li[role="tab"]')
  );

  // Find tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('div[role="tabpanel"]')
  );

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) {
    // If mismatch, do not replace
    return;
  }

  // For each tab, create a row: [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    // Get label text
    const labelText = tabLabel.textContent.trim();

    // Get tab panel content
    const panel = tabPanels[idx];
    // Defensive: If panel is missing, skip
    if (!panel) return;

    // The content is the entire tabpanel div (including nested contentfragment/article)
    // We want to reference the contentfragment/article inside the tabpanel
    const cf = panel.querySelector('article.cmp-contentfragment');
    // If not found, fallback to panel itself
    const contentEl = cf || panel;

    // Add row: [label, content]
    rows.push([labelText, contentEl]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(blockTable);
}
