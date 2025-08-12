/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual tabs block for this section.
  // It is marked by '.cmp-tabs' inside a parent with class 'tabs'
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // 1. HEADER ROW
  // This must be exactly as specified in block info
  const headerRow = ['Tabs (tabs12)'];

  // 2. TAB LABELS ROW
  // Get tab labels from the tablist (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('li'));
  // Defensive: if there are no tabs, abort.
  if (tabItems.length === 0) return;
  const labelRow = tabItems.map(tab => tab.textContent.trim());

  // 3. TAB CONTENT ROW
  // Each tab has a corresponding panel with data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Defensive: if the number of panels does not match tab count, handle gracefully
  // We'll map panels to tabs only up to the minimum length
  const contentRow = tabPanels.slice(0, tabItems.length).map(panel => {
    // Each panel typically contains a main contentfragment <article>
    // If not, use the panel itself
    const contentFragment = panel.querySelector('article') || panel;
    // Keep reference to the contentfragment directly (do not clone)
    return contentFragment;
  });
  // If there are fewer panels than labels, pad remaining cells with empty strings
  while (contentRow.length < labelRow.length) {
    contentRow.push('');
  }

  // Compose the final cells array in correct order
  // Row 0: Header (single cell), Row 1: Tab labels, Row 2: Tab content
  const cells = [headerRow, labelRow, contentRow];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block wrapper with the block table
  const tabsWrapper = element.querySelector('.tabs');
  if (tabsWrapper && tabsWrapper.parentNode) {
    tabsWrapper.parentNode.replaceChild(blockTable, tabsWrapper);
  }
}
