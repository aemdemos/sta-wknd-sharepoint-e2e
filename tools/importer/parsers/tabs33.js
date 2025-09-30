/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs.panelcontainer block (the source tabs block)
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs inside
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map((li) => li.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure labels and panels match
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build the table rows
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the content to avoid moving it from DOM
    const content = document.createElement('div');
    // Only take the direct children of the tabpanel (avoid id/class pollution)
    Array.from(panel.childNodes).forEach((node) => {
      content.appendChild(node.cloneNode(true));
    });

    rows.push([label, content]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
