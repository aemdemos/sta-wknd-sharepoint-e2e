/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs.cmp-tabs wrapper inside the given element
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Find tab labels
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get the tab panels (order should match tabs)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Set up the cells array for the block table
  // Header matches the spec exactly
  const cells = [['Tabs (tabs31)']];

  // For each tab, add a row with the label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    let panelContent = null;
    if (tabPanels[i]) {
      // Try to get the contentfragment article (which contains all for this tab)
      const contentFragment = tabPanels[i].querySelector('article');
      if (contentFragment) {
        // Reference the existing element in the DOM
        panelContent = contentFragment;
      } else {
        // If missing, fall back to placing the panel itself
        panelContent = tabPanels[i];
      }
    } else {
      panelContent = '';
    }
    cells.push([label, panelContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
