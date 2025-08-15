/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab list items (tab labels)
  const tabLabelNodes = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabLabels = tabLabelNodes.map(li => li.textContent.trim());

  // Get all tab panels (tab contents)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Each data-cmp-hook-tabs="tabpanel" panel may contain a contentfragment (article) which holds the actual content for the tab
  // We want to reference the entire article element, as per guidelines
  const tabContents = tabPanels.map(panel => {
    // Look for the main content fragment inside the panel
    const contentFrag = panel.querySelector('article.cmp-contentfragment');
    if (contentFrag) {
      return contentFrag;
    } else {
      // If not found, use the panel itself
      return panel;
    }
  });

  // Table header as per guidelines (block name and variant)
  const headerRow = ['Tabs (tabs37)'];

  // Build the table: first row is header, second row is labels, third row is contents
  const cells = [
    headerRow,
    tabLabels,
    tabContents
  ];

  // Create the block table using WebImporter.DOMUtils.createTable
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with our new block table
  tabsBlock.replaceWith(block);
}
