/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.closest('.tabs, .panelcontainer, .cmp-tabs') || element;
  // Defensive: find .cmp-tabs inside the block
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;

  // Get tab labels (li elements in tablist)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"]'));

  // Build rows: header first
  const rows = [ ['Tabs (tabs25)'] ];

  // For each tab, find its label and corresponding panel
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: get tab label text
    const label = tabLabel.textContent.trim();
    // Find the panel this tab controls
    const controlsId = tabLabel.getAttribute('aria-controls');
    let panel = tabPanels.find(p => p.id === controlsId);
    // Defensive: fallback to index if not found
    if (!panel) panel = tabPanels[i];
    // Defensive: if still not found, skip
    if (!panel) return;
    // The content for the tab is the entire panel content
    // (including images, paragraphs, etc.)
    // We'll use the direct children of the panel for resilience
    const contentNodes = Array.from(panel.childNodes).filter(n => {
      // Filter out empty text nodes
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      return true;
    });
    // If only one element, just use it; else, use array
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    rows.push([label, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
