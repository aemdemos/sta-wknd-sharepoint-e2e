/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (the tab container)
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the main tab component inside the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels (li elements in the tablist)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only keep as many panels as there are labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build the table rows
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  for (let i = 0; i < tabCount; i++) {
    // Get tab label text
    const label = tabLabels[i].textContent.trim();
    // Get tab content (the panel)
    const panel = tabPanels[i];
    // Defensive: If panel is missing, skip
    if (!panel) continue;
    // For resilience, use the entire panel content as the cell
    // Remove the tabpanel container, but keep its children
    const tabContentFragment = document.createElement('div');
    // Move all children of the tabpanel into the fragment
    Array.from(panel.childNodes).forEach((child) => {
      tabContentFragment.appendChild(child.cloneNode(true));
    });
    rows.push([label, tabContentFragment]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
