/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block (by class)
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs34)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((labelEl, idx) => {
    // Defensive: get label text
    const label = labelEl.textContent.trim();

    // Defensive: get tab panel
    const panel = tabPanels[idx];
    let tabContent = null;
    if (panel) {
      // Use the entire tabpanel content (preserves images, headings, etc)
      // Defensive: find the main contentfragment/article inside the tabpanel
      const contentFragment = panel.querySelector('.contentfragment, article');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // Fallback: use the panel itself
        tabContent = panel;
      }
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
