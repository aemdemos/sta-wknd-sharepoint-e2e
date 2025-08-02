/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsSection = element.querySelector('.tabs');
  if (!tabsSection) return;
  const tabsRoot = tabsSection.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Header row should use the correct block name, matching the example
  const headerRow = ['Tabs (tabs15)'];

  // Gather tab labels (li elements under .cmp-tabs__tablist)
  const tabLabelsEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));

  // Gather tab panels (content), which are direct children with .cmp-tabs__tabpanel
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Edge case: If tabs and panels count do not match, only take matching pairs
  const tabCount = Math.min(tabLabelsEls.length, tabPanels.length);

  const rows = [];
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabelsEls[i].textContent.trim();
    // Reference the existing panel element directly
    const panel = tabPanels[i];
    // Defensive: fallback to an empty div if for some reason panel is missing
    rows.push([label, panel || document.createElement('div')]);
  }

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the whole tabs section with the block
  tabsSection.replaceWith(block);
}
