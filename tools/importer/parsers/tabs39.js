/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Header row as specified
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, i) => {
    // Defensive: get corresponding panel
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // Use the entire contentfragment/article inside the panel
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        contentCell = contentFragment;
      } else {
        // Fallback: use panel's children
        contentCell = Array.from(panel.childNodes);
      }
    } else {
      contentCell = '';
    }
    rows.push([label, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(block);
}
