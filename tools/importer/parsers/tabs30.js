/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels in order
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Extract each tab's panel content in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare table rows
  const cells = [];
  // Set header row as in the example structure
  cells.push(['Tabs (tabs30)']);

  // Process each tab's label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Defensive: reference existing panel if available, otherwise empty string
    let content = tabPanels[i] || document.createTextNode('');
    cells.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
