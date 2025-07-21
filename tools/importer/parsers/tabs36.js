/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the actual tabs block inside the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and IDs
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  const tabIds = [];
  if (tabList) {
    tabList.querySelectorAll(':scope > li').forEach(li => {
      tabLabels.push(li.textContent.trim());
      if (li.hasAttribute('aria-controls')) {
        tabIds.push(li.getAttribute('aria-controls'));
      } else {
        tabIds.push(null);
      }
    });
  }

  // Gather content for each tab
  const tabContents = [];
  tabIds.forEach(tabId => {
    if (!tabId) {
      tabContents.push('');
      return;
    }
    const tabPanel = tabsBlock.querySelector(`#${tabId}`);
    if (tabPanel) {
      // Try to grab .cmp-contentfragment__elements, or fallback
      let tabContentElem = null;
      // Main content is often inside .contentfragment
      const cf = tabPanel.querySelector('.contentfragment');
      if (cf) {
        const cfElements = cf.querySelector('.cmp-contentfragment__elements');
        if (cfElements) {
          tabContentElem = cfElements;
        } else {
          tabContentElem = cf;
        }
      }
      if (!tabContentElem) {
        // fallback: use tabPanel itself
        tabContentElem = tabPanel;
      }
      tabContents.push(tabContentElem);
    } else {
      tabContents.push('');
    }
  });

  // Build the header row
  const headerRow = ['Tabs (tabs36)'];
  // Each row: [tab label, tab content]
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: reference elements directly, never clone
    rows.push([tabLabels[i], tabContents[i]]);
  }

  // Create table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the entire tabs block with the table
  tabsBlock.replaceWith(blockTable);
}
