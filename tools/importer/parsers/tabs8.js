/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure equal number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    // Get label text
    const label = tabLabel.textContent.trim();
    // Get panel content
    const panel = tabPanels[i];
    // Find the contentfragment inside the panel
    let content = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (!content) {
      // fallback: use panel itself
      content = panel;
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
