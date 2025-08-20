/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block within 'element' (it may be nested)
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels, preserving order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children).map(li => li.textContent.trim()) : [];

  // Find the tab panels, assuming each has [data-cmp-hook-tabs="tabpanel"]
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose the header row, must match example block name
  const headerRow = ['Tabs (tabs23)'];

  // Build each tab as a row: [Tab Label, Tab Content]
  const rows = tabPanels.map((panel, i) => {
    // Tab Label (from tabLabels, fallback if missing)
    const label = tabLabels[i] || `Tab ${i+1}`;
    // Tab Content: Reference the panel's first content element (usually a .contentfragment)
    // Use the real child element from the DOM, don't clone
    let content = null;
    // Try to reference only the article/contentfragment if present, else the entire panel
    // Remove any empty grid wrappers (e.g. aem-Grid with no content) for cleanliness
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      content = cf;
    } else {
      // If not, try to find meaningful content, else use the full panel
      // Avoid pulling out empty .aem-Grid, but keep actual content like <ul>, <p>, etc.
      // If panel has only one non-empty div/element, use that
      const candidates = Array.from(panel.children).filter(c => c.textContent.trim().length > 0);
      if (candidates.length === 1) {
        content = candidates[0];
      } else {
        content = panel;
      }
    }
    return [label, content];
  });

  // Combine header and rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace only the .tabs block (not the top-level container)
  const tabsContainer = element.querySelector('.tabs');
  if (tabsContainer) {
    tabsContainer.replaceWith(block);
  }
}
