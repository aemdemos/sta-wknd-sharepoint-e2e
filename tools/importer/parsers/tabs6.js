/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block inside the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract the tab labels (the tab headers/labels)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map((li) => li.textContent.trim());

  // Extract all tab content panels
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the header row: exactly as specified
  const headerRow = ['Tabs (tabs6)'];

  // Build the tab rows - each is [TabLabel, TabContent]
  const rows = tabPanels.map((panel, idx) => {
    // Determine the label
    const label = tabLabels[idx] || `Tab ${idx + 1}`;
    // Try to get the main article/contentfragment inside this panel
    // If not found, use the panel itself
    let content = panel.querySelector('.contentfragment') || panel;
    return [label, content];
  });

  // Create the table cell array
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original block with the constructed block table
  element.replaceWith(block);
}
