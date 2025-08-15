/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get all tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row, exactly as required
  const headerRow = ['Tabs (tabs6)'];
  const rows = [];

  // For each tab, extract its label and panel content
  tabLabels.forEach((labelEl) => {
    const label = labelEl.textContent.trim();
    // Find the associated tabpanel by aria-labelledby
    const panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === labelEl.id);

    let tabContent;
    if (panel) {
      // Reference the entirety of the tabpanel's content
      // If article (contentfragment) exists, reference that for conciseness
      const contentFragment = panel.querySelector('article');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // Fallback: reference the panel itself (avoiding re-cloning)
        tabContent = panel;
      }
    } else {
      // Edge case: tab panel missing, fallback to empty text node
      tabContent = document.createTextNode('');
    }
    rows.push([label, tabContent]);
  });

  // Compose the table rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
