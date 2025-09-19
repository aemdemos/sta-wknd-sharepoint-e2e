/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (the one containing the tab interface)
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element inside the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only keep as many panels as there are labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build the rows: header, then one row per tab (label, content)
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: preserve original elements, not clones
    // The content is usually a .contentfragment > article
    let tabContent = [];
    // Find the main content container inside the tab panel
    // Usually .contentfragment or direct children
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      // Use all children of contentFragment (usually an article)
      tabContent = Array.from(contentFragment.children);
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.children);
    }
    // Remove empty text nodes and whitespace-only elements
    tabContent = tabContent.filter(el => {
      if (el.nodeType === Node.ELEMENT_NODE) return true;
      if (el.nodeType === Node.TEXT_NODE) return el.textContent.trim().length > 0;
      return false;
    });
    // If only one element, just use it; otherwise, use the array
    const contentCell = tabContent.length === 1 ? tabContent[0] : tabContent;
    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
