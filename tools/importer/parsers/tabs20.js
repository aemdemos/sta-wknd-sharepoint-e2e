/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // For each tab, collect label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    // Defensive: Find the main content inside the panel
    // Usually a contentfragment/article
    let tabContent = tabPanels[i];
    // If the panel contains a contentfragment, use that
    const cf = tabPanels[i].querySelector('.cmp-contentfragment');
    if (cf) tabContent = cf;
    // Otherwise, use the panel itself
    rows.push([labelText, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(block);
}
