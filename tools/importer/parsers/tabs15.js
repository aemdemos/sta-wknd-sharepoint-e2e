/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // For each tab, add label and content
  tabLabels.forEach((labelEl, idx) => {
    // Defensive: Get label text
    const label = labelEl.textContent.trim();
    // Defensive: Get panel
    const panel = tabPanels[idx];
    let tabContent = [];
    if (panel) {
      // For resilience, reference the entire tabpanel content
      // If the panel contains a single child, use that; else, use all children
      if (panel.children.length === 1) {
        tabContent = [panel.children[0]];
      } else {
        tabContent = Array.from(panel.childNodes).filter(n => n.nodeType === 1);
        // If no element children, fallback to panel itself
        if (tabContent.length === 0) tabContent = [panel];
      }
    }
    rows.push([label, tabContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original tabs block
  tabsBlock.replaceWith(block);
}
