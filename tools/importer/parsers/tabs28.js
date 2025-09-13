/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Block header row as specified
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Find the contentfragment inside the panel
    let contentFragment = panel.querySelector('.contentfragment');
    // If not found, use panel itself
    const tabContent = contentFragment ? contentFragment : panel;

    // Each row: [Tab Label, Tab Content]
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
