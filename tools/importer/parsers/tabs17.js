/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure we have matching labels and panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row as required
  const headerRow = ['Tabs (tabs17)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((labelEl, idx) => {
    // Defensive: get label text
    const label = labelEl.textContent.trim();
    // Defensive: get panel content
    const panel = tabPanels[idx];
    // For resilience, grab the entire contentfragment/article inside the panel if present
    let tabContent = null;
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback: use the whole panel
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
