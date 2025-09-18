/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the actual tabs container (may be nested)
  let cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) cmpTabs = tabsBlock;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist li'));
  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Defensive: Get label text
    const label = labelEl.textContent.trim();
    // Defensive: Get tab panel content
    const panel = tabPanels[idx];
    let content = null;
    if (panel) {
      // Use the entire tab panel as content for resilience
      content = panel;
    } else {
      content = '';
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the block table
  tabsBlock.replaceWith(block);
}
