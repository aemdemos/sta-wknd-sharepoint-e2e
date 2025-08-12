/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (order matters)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist [role=tab]'));
  // Get all tab panels (order matches tabLabels)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the header row
  const headerRow = ['Tabs (tabs10)'];

  // Compose rows: each tab label in first cell, corresponding panel content in second cell
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // Use label text as first cell
    const label = tabLabels[i].textContent.trim();
    // For content, reference the existing tab panel's content
    // Panels could have content wrapped in article or direct children
    let content = tabPanels[i].querySelector('article') || tabPanels[i];
    rows.push([label, content]);
  }
  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element with block table
  element.replaceWith(block);
}
