/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header row for the block table
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: find the main contentfragment inside the panel
    let contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the entire contentfragment as the tab content
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.childNodes);
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(blockTable);
}
