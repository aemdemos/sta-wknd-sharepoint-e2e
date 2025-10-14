/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsRoot.classList.contains('cmp-tabs') ? tabsRoot : tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Find tab headers (tab labels)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabHeaders = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Find tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: match headers to panels by order (AEM tabs use same order)
  const numTabs = Math.min(tabHeaders.length, tabPanels.length);

  // Table header row
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  for (let i = 0; i < numTabs; i++) {
    const tabLabel = tabHeaders[i].textContent.trim();
    const tabPanel = tabPanels[i];

    // Defensive: clone the tabPanel content for safety
    // But we want only the actual content, not the outer tabpanel div
    // Usually the first child is a contentfragment/article, so use that if present
    let contentElem = null;
    if (tabPanel.children.length === 1) {
      contentElem = tabPanel.children[0];
    } else {
      // fallback: use all children as a fragment
      contentElem = document.createElement('div');
      Array.from(tabPanel.childNodes).forEach(node => contentElem.appendChild(node.cloneNode(true)));
    }
    rows.push([tabLabel, contentElem]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
