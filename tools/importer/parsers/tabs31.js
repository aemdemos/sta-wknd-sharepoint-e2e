/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Build rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((tab, i) => {
    // Tab label text
    const label = tab.textContent.trim();
    // Corresponding tab panel
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Find main content fragment inside panel
      const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
      if (contentFragment) {
        // Use the entire content fragment as tab content (reference, not clone)
        content = contentFragment;
      } else {
        // Fallback: use all children of panel
        content = Array.from(panel.childNodes);
      }
    }
    return [label, content];
  });

  // Table header: must match block name exactly
  const headerRow = ['Tabs (tabs31)'];

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs block with the new table
  element.replaceWith(block);
}
