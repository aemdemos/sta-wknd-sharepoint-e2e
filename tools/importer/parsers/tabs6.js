/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside this element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist (usually <ol> or <ul> with .cmp-tabs__tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));

  // Get all tabpanel contents (divs with class .cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Safety: make sure number of tabs and panels match
  if (tabLabels.length !== tabPanels.length) {
    // Fallback: try to pair using aria-controls/aria-labelledby attributes
    // Build a map of tab id -> panel
    const panelMap = {};
    tabPanels.forEach(panel => {
      const labelledby = panel.getAttribute('aria-labelledby');
      if (labelledby) {
        panelMap[labelledby] = panel;
      }
    });
    var matchedPanels = tabLabels.map(lbl => {
      const tabId = lbl.getAttribute('id');
      return panelMap[tabId] || null;
    });
    // If any is still null, can't recover
    if (matchedPanels.some(p => !p)) return;
    // Overwrite tabPanels
    tabPanels.length = 0;
    matchedPanels.forEach(p => tabPanels.push(p));
  }

  // Header row exactly as instructed
  const cells = [
    ['Tabs (tabs6)'],
  ];

  // Now build each tab row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Get label text as string
    const labelText = label.textContent.trim();

    // For content: build one cell containing all meaningful children of the panel
    // We want to preserve semantic content and reference existing elements
    // Typically skip empty grids/whitespace-only nodes
    const contentNodes = Array.from(panel.childNodes).filter((node) => {
      // Remove whitespace-only text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      // Remove aem-Grid divs that are empty
      if (node.nodeType === Node.ELEMENT_NODE && node.matches('div.aem-Grid')) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });

    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }

    // Add row: [labelText, contentCell]
    cells.push([labelText, contentCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table (only the .cmp-tabs element, not the top-level)
  tabsBlock.replaceWith(table);
}
