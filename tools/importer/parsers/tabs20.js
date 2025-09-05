/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (tab content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((labelEl, idx) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();
    // Tab content panel
    const panel = tabPanels[idx];

    // Defensive: Find the main content fragment inside the panel
    let tabContent = null;
    // Usually a contentfragment/article, but fallback to panel itself
    tabContent = panel.querySelector('.contentfragment, article') || panel;

    // For resilience, include the entire content fragment/article as the cell
    rows.push([
      tabLabel,
      tabContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
