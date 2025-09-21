/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build table rows
  const rows = [];
  // Header row as required
  const headerRow = ['Tabs (tabs23)'];
  rows.push(headerRow);

  // For each tab, get label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: Some panels may be missing
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // Find the contentfragment inside the panel
      const cf = panel.querySelector('.contentfragment');
      if (cf) {
        // Use the entire contentfragment as the cell
        contentCell = cf;
      } else {
        // Fallback: use panel itself
        contentCell = panel;
      }
    } else {
      // Fallback: empty cell
      contentCell = '';
    }
    rows.push([label, contentCell]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
