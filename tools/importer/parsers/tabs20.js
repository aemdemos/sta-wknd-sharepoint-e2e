/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only use as many panels as labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Table header row
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // Each tab: [label, content]
  for (let i = 0; i < tabCount; i++) {
    // Tab label text
    const label = tabLabels[i].textContent.trim();

    // Tab panel content
    const panel = tabPanels[i];
    // Defensive: If the panel is empty, skip
    if (!panel) continue;

    // The contentfragment inside the panel
    const cf = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (cf) {
      // Use the entire contentfragment as the tab content
      tabContent = cf;
    } else {
      // If not found, use the panel's content
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(block);
}
