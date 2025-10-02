/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (the root for the tabs UI)
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels from the tablist
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Get the tab panels (content for each tab)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: only proceed if we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per requirements
  const headerRow = ['Tabs (tabs11)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the content to avoid moving it out of the DOM
    const content = document.createElement('div');
    // Only append the children of the tabpanel (not the tabpanel itself)
    Array.from(panel.childNodes).forEach(child => {
      content.appendChild(child.cloneNode(true));
    });
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
