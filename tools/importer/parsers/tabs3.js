/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs3)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Defensive: get tab label text
    const tabLabel = labelEl.textContent.trim();
    // Defensive: get tab panel content
    const panelEl = tabPanels[i];
    // For robustness, reference the entire panel content
    // Find the main content fragment inside each panel
    let tabContent = null;
    const contentFragment = panelEl.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panelEl itself
      tabContent = panelEl;
    }
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(block);
}
