/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs inside the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with class cmp-tabs__tabpanel)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: match tabPanels to tabLabels by order
  const rows = [];
  // Header row
  const headerRow = ['Tabs (tabs13)'];
  rows.push(headerRow);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // For tab content, extract the main content fragment/article inside the tabpanel
    let tabContent = null;
    // Try to find the main contentfragment/article inside the tabpanel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Use the contentFragment as the tab content
      tabContent = contentFragment;
    } else {
      // Fallback: use the whole panel
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
