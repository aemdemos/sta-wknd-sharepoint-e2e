/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 2. Tab labels
  let tabLabels = [];
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim());
  }

  // 3. Tab panels content
  // Need to order panels according to tab order. Panels have IDs matching tab 'aria-controls'
  let tabContents = [];
  if (tabList) {
    const tabNodes = Array.from(tabList.querySelectorAll('[role="tab"]'));
    tabNodes.forEach(tab => {
      const panelId = tab.getAttribute('aria-controls');
      const panel = panelId ? tabs.querySelector(`#${panelId}`) : null;
      if (panel) {
        // Use the article/contentfragment inside the panel if possible
        const article = panel.querySelector('article');
        if (article) {
          tabContents.push(article);
        } else {
          tabContents.push(panel);
        }
      } else {
        tabContents.push(document.createTextNode(''));
      }
    });
  }

  // 4. Compose the table structure as per block spec
  // Header row
  const rows = [ ['Tabs (tabs11)'] ];
  // Tab rows: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Always reference existing DOM elements only
    rows.push([tabLabels[i], tabContents[i]]);
  }

  // 5. Replace original .cmp-tabs with new table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
