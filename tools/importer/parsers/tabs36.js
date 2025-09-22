/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element (the main tabs container)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only keep as many panels as labels, in order
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Extract the main content inside the tab panel
    // Usually a .contentfragment or similar
    let content = null;
    // Try to find .contentfragment, fallback to panel itself
    const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (cf) {
      // Remove the h3 title if present (to avoid duplicate tab label)
      const cfClone = cf.cloneNode(true);
      const h3 = cfClone.querySelector('h3');
      if (h3) h3.remove();
      content = cfClone;
    } else {
      // fallback: use all children
      const frag = document.createElement('div');
      Array.from(panel.childNodes).forEach(n => frag.appendChild(n.cloneNode(true)));
      content = frag;
    }
    tabRows.push([label, content]);
  }

  // Compose the table rows
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
