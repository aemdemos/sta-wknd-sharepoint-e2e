/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (text of each tab) from tablist
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tabpanels (content panels), in order
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Compose the rows for the block table
  const rows = [['Tabs (tabs31)']];
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: skip if either tab or panel is missing
    if (!tabLabels[i] || !tabPanels[i]) continue;
    // The panel generally contains a contentfragment/article with all tab content, including headings, images, paragraphs, etc.
    // We'll put ALL of the content in that tab's block cell by referencing its children (do not clone!)
    // We use a fragment/array of children so we don't break references
    const contentChildren = Array.from(tabPanels[i].childNodes).filter(
      node => (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()))
    );
    // If there's no content, we put an empty div (to fill the cell)
    rows.push([
      tabLabels[i],
      contentChildren.length > 0 ? contentChildren : document.createElement('div')
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
