/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels in order
  const tabLabelEls = tabsContainer.querySelectorAll('.cmp-tabs__tablist > li');
  // Get the tab panels in order
  const tabPanels = tabsContainer.querySelectorAll('.cmp-tabs__tabpanel');

  // Header row as in the example:
  const headerRow = ['Tabs (tabs13)'];

  // Build the tab rows: [Tab Label, Tab Content]
  const rows = Array.from(tabLabelEls).map((tabEl, idx) => {
    const label = tabEl.textContent.trim();
    const panel = tabPanels[idx];
    let content = null;
    if (panel) {
      // If the panel only has a single main wrapper, use that
      if (panel.children.length === 1) {
        content = panel.children[0];
      } else {
        // If not, reference all children as an array
        content = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())).map(n => n);
        if (content.length === 1) content = content[0];
      }
    }
    return [label, content];
  });

  // Build the table structure
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
