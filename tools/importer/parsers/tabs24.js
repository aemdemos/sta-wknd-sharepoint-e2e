/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block (the tabs container)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
    tabLabels.push(tab.textContent.trim());
  });

  // Get tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Build rows: header, then one row per tab
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Defensive: find the main content fragment/article inside the tab panel
      let contentFragment = panel.querySelector('article');
      if (contentFragment) {
        // Remove the title (h3) from the content fragment if present
        const contentClone = document.createElement('div');
        // Only collect children except h3
        Array.from(contentFragment.children).forEach(child => {
          if (!(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'))) {
            contentClone.appendChild(child.cloneNode(true));
          }
        });
        contentCell = contentClone;
      } else {
        // fallback: just use the panel's children
        const panelContent = document.createElement('div');
        Array.from(panel.childNodes).forEach(n => {
          if (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())) {
            panelContent.appendChild(n.cloneNode(true));
          }
        });
        contentCell = panelContent;
      }
    }
    rows.push([label, contentCell]);
  }

  // Create table and replace original tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
