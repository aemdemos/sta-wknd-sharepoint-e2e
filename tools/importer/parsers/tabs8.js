/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (first column)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (second column)
  // Only direct children of the tabs block that are panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the header row exactly as required
  const headerRow = ['Tabs (tabs8)'];
  const cells = [headerRow];

  // For each tab, build a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';

    // Defensive: panel might be missing
    let tabContent = '';
    if (tabPanels[i]) {
      // Reference the panel's main content fragment/article
      const article = tabPanels[i].querySelector('article');
      if (article) {
        tabContent = article;
      } else {
        // If no article, use panel itself
        tabContent = tabPanels[i];
      }
    }
    cells.push([label, tabContent]);
  }

  // Create the block table using the helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs container with the new block table (reference, don't clone)
  tabsBlock.replaceWith(block);
}
