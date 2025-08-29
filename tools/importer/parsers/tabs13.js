/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual tabs block within the supplied element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Build the block table starting with the proper header
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // Extract tab labels in order
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Extract tab panels (in order)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // For each tab, pair label with its panel content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i] || document.createElement('div'); // fallback to prevent error
    // Reference the entire contentfragment/article block if available, else the panel itself
    let content = panel.querySelector('article.cmp-contentfragment');
    if (!content) {
      // If not found, use the whole panel (should be rare but robust)
      content = panel;
    }
    rows.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
