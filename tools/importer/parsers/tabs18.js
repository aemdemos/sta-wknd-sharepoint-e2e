/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get tab panels (order should match tabLabels)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs18)']);

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content (may be complex)
    const panel = tabPanels[idx];
    // Defensive: If panel is missing, skip
    if (!panel) return;

    // For resilience, grab the direct contentfragment/article if present
    let tabContent;
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of panel
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((node) => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block
  tabsBlock.replaceWith(block);
}
