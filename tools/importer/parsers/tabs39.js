/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Get tab headers
  const tabHeaders = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure tabHeaders and tabPanels match
  if (tabHeaders.length !== tabPanels.length || tabHeaders.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabHeaders.forEach((tabHeader, i) => {
    // Tab label
    const label = tabHeader.textContent.trim();

    // Tab content: use the panel's main content
    const panel = tabPanels[i];
    if (!panel) return;
    // Find the main contentfragment inside the panel
    const cf = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (cf) {
      // Use the referenced contentfragment element (not clone)
      tabContent = cf;
    } else {
      // Fallback: use all children
      tabContent = Array.from(panel.childNodes);
    }
    rows.push([label, tabContent]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original block
  tabsBlock.replaceWith(table);
}
