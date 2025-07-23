/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));

  // Extract tab panels (each panel is one tab's content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row for the block table
  const headerRow = ['Tabs (tabs34)'];

  // Edge case: If labels and panels count mismatch, skip or pair only available
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // For each tab, build a row: [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i].textContent.trim();
    
    // Use the *original* panel content, not cloned
    const panel = tabPanels[i];
    // Find the main .cmp-contentfragment inside the panel
    let tabContentElement = panel.querySelector('.cmp-contentfragment');
    let contentCell;
    if (tabContentElement) {
      // Remove the tab title only if it exactly matches the tab label
      let titleElement = tabContentElement.querySelector('.cmp-contentfragment__title');
      if (titleElement && titleElement.textContent.trim() === label) {
        titleElement.remove();
      }

      // Reference the element directly, not clone
      contentCell = tabContentElement;
    } else {
      // If no cmp-contentfragment, just use the panel
      contentCell = panel;
    }
    rows.push([label, contentCell]);
  }

  // Compose the block table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsContainer.replaceWith(table);
}
