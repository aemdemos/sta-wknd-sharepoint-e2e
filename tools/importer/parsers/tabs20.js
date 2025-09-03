/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs20)']);

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const label = labelEl.textContent.trim();
    // Tab panel content
    const panel = tabPanels[i];
    // Defensive: Find the main content fragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsRoot.replaceWith(block);
}
