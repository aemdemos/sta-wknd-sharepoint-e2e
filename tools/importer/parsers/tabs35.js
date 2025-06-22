/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels (li[role="tab"])
  const tabList = cmpTabs.querySelector('ol[role="tablist"]');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract tab content panels in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"]'));

  // Make the table header row
  const rows = [];
  rows.push(['Tabs (tabs35)']);

  // For each tab, add [Label, Content] row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Content cell: collect all children as elements/array, referencing existing nodes
    const contentNodes = [];
    panel.childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        contentNodes.push(child);
      } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        // Text outside of elements gets wrapped for structure
        const div = document.createElement('div');
        div.textContent = child.textContent.trim();
        contentNodes.push(div);
      }
    });
    // If no content, just empty string; if one, use single element; else, array
    let contentCell = '';
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    }
    rows.push([label, contentCell]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
