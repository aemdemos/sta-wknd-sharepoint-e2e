/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs.panelcontainer block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs inside
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure number of labels matches number of panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build table rows
  const rows = [];
  // Header row as required
  const headerRow = ['Tabs (tabs25)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: If panel is hidden, skip (shouldn't happen, but just in case)
    if (!panel) continue;

    // Extract the main content for the tab
    // We'll use the entire contentfragment/article inside the tabpanel
    let content = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // Fallback: use the panel's children
      content = Array.from(panel.childNodes);
    }
    rows.push([label, content]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
