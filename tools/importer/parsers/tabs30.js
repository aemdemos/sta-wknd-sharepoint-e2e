/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []).map(li => li.textContent.trim());

  // Get tabpanels in order as in DOM
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  
  // Create header row (exact block name per requirements)
  const rows = [['Tabs (tabs30)']];

  // For each tab, create a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // Find the content fragment's main content without the repeated h3 title
      // The actual content is inside .cmp-contentfragment__elements
      const fragment = panel.querySelector('.cmp-contentfragment__elements');
      if (fragment) {
        contentCell = fragment;
      } else {
        // fallback: use the panel's full content
        contentCell = panel;
      }
    } else {
      contentCell = '';
    }
    rows.push([label, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(table, element);
}