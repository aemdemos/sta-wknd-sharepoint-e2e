/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Table header must be exactly as specified
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  // For each tab, collect label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;

    // Defensive: Find the main content fragment inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      // Reference the content fragment node directly
      tabContent = contentFragment;
    } else {
      // Fallback: Use the panel itself
      tabContent = panel;
    }

    // Always reference the existing node, do not clone
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block table
  tabsBlock.replaceWith(block);
}
