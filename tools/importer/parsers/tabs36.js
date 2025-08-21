/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsEl = element.querySelector('.tabs .cmp-tabs');
  if (!tabsEl) return;

  // Get all tab labels from the tablist (preserve order)
  const tablist = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panel elements (preserve order as in the DOM)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row: block name exactly as required
  const cells = [['Tabs (tabs36)']];

  // For each tab, add a row with [Tab Label, Tab Content]
  tabLabels.forEach((tabLabelEl, idx) => {
    const tabLabel = tabLabelEl.textContent.trim();
    // Match panel by index (as in markup)
    const panelEl = tabPanels[idx];
    if (!panelEl) return; // Defensive: skip if missing
    // Reference the first meaningful child of the panel, if available
    let tabContent = null;
    // Prefer .contentfragment article inside tabpanel, else whole panel
    const article = panelEl.querySelector('article.cmp-contentfragment');
    if (article) {
      tabContent = article;
    } else {
      // Use the panel itself as fallback
      tabContent = panelEl;
    }
    // Defensive: only add row if both label and content exist
    if (tabLabel && tabContent) {
      cells.push([tabLabel, tabContent]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs block with the new table
  element.querySelector('.tabs').replaceWith(block);
}
