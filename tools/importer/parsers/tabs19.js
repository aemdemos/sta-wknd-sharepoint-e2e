/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels from tablist in order
  const tabLabelsEls = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );
  // If there are no tabs, abort
  if (tabLabelsEls.length === 0) return;

  // Get all tabpanel elements (content per tab) in order
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );
  // If there are no tab panels, abort
  if (tabPanels.length === 0) return;

  // Compose the table header (block name, exactly as required)
  const headerRow = ['Tabs (tabs19)'];
  // Compose the tab label row (second row)
  const tabLabelRow = tabLabelsEls.map(tabEl => tabEl.textContent.trim());
  // Compose the tab content row (third row)
  // Each panel may contain a contentfragment/article or just content
  const tabContentRow = tabPanels.map(panel => {
    // Try to find the main .cmp-contentfragment article inside this panel
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) return cf;
    // Otherwise, use the panel div itself
    return panel;
  });

  // Build the table: header, tab labels, tab content
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
