/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the tab block)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get all tab panels, preserving DOM nodes as much as possible
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll(':scope > [role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Construct the table rows
  const rows = [];
  // Header row must be a single cell (one column)
  rows.push(['Tabs (tabs3)']);

  // Each tab row - two cells: [label, content]
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Reference the direct child element with class 'contentfragment' if available
    const contentEl = panel.querySelector(':scope > .contentfragment') || panel;
    rows.push([label, contentEl]);
  }

  // To ensure the header row is a single cell, but other rows have two,
  // we must create a table where the first <tr> has one <th>, and the rest <tr>s have two <td>s.
  // WebImporter.DOMUtils.createTable supports this array shape.

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block (not the whole element) with the block table
  tabsBlock.replaceWith(block);
}
