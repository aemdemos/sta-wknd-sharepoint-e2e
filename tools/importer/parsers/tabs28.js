/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements) and panel IDs
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabItems = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabMap = tabItems.map(tabItem => {
    return {
      label: tabItem.textContent.trim(),
      tabPanelId: tabItem.getAttribute('aria-controls'),
    };
  });

  // Tab content rows: each is [label, content]
  const rows = tabMap.map(tab => {
    const tabPanel = tabsBlock.querySelector(`#${tab.tabPanelId}`);
    let tabContent = document.createElement('div');
    if (tabPanel) {
      let contentToUse = null;
      if (tabPanel.querySelector('article')) {
        contentToUse = tabPanel.querySelector('article');
      } else {
        const tempDiv = document.createElement('div');
        Array.from(tabPanel.childNodes).forEach(child => {
          if (!(child.nodeType === 1 && (child.classList.contains('aem-Grid') || child.classList.contains('aem-GridColumn')) && child.textContent.trim() === '')) {
            tempDiv.appendChild(child.cloneNode(true));
          }
        });
        contentToUse = tempDiv;
      }
      tabContent = contentToUse && contentToUse.innerHTML.trim() !== '' ? contentToUse : tabPanel;
    }
    return [tab.label, tabContent];
  });

  // Create table manually to ensure the header row is a single cell that spans both columns
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Tabs (tabs28)';
  headerTh.setAttribute('colspan', '2');
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);
  for (const row of rows) {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = row[0];
    const td2 = document.createElement('td');
    if (typeof row[1] === 'string') {
      td2.innerHTML = row[1];
    } else {
      td2.append(row[1]);
    }
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
  }

  tabsBlock.replaceWith(table);
}
