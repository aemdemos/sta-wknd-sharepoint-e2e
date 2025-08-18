/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element within this block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract the tab labels (li elements in the tablist)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract all tab panels (order matches tabLabels)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the header row: block name exactly as required
  const cells = [['Tabs (tabs34)']];

  // Defensive coding: extra check for labels and panels count
  const rowCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < rowCount; i++) {
    // Use the existing tab label text
    const label = tabLabels[i].textContent.trim();
    // Use the existing tab panel element as is (preserves headings, images, lists, etc.)
    const content = tabPanels[i];
    cells.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
