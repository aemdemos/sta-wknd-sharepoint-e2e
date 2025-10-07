/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find tab navigation (tab labels)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Find tab panels (tab content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure we have matching labels and panels
  if (tabLabels.length !== tabPanels.length) {
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Table header row with colspan=2 for clarity
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Tabs (tabs39)';
  th.colSpan = 2;
  headerTr.appendChild(th);
  thead.appendChild(headerTr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      tabContent = panel;
    }
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.textContent = label;
    const tdContent = document.createElement('td');
    tdContent.appendChild(tabContent.cloneNode(true));
    tr.appendChild(tdLabel);
    tr.appendChild(tdContent);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tabsRoot.replaceWith(table);
}
