/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab navigation (tab headers)
  const tabNav = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabNav) return;

  // Get all tab header elements (li)
  const tabHeaders = Array.from(tabNav.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (content areas)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure we have matching headers and panels
  if (tabHeaders.length !== tabPanels.length || tabHeaders.length === 0) return;

  // Table header row (block name)
  const headerRow = ['Tabs (tabs28)'];

  // Build rows: each row is [tab label, tab content]
  const rows = tabHeaders.map((tabHeader, i) => {
    // Tab label (text)
    const label = tabHeader.textContent.trim();

    // Tab content: grab the entire panel content
    const panel = tabPanels[i];
    // Defensive: if panel is missing, fallback to empty cell
    let contentCell;
    if (panel) {
      // Instead of picking individual children, reference the whole panel content
      // This makes the block resilient to variations
      // But we want only the actual content, not the tabpanel wrapper
      // Find the contentfragment inside the panel
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        // If no contentfragment, use all children
        contentCell = Array.from(panel.childNodes);
      }
    } else {
      contentCell = '';
    }
    return [label, contentCell];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
