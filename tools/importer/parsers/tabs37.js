/* global WebImporter */
export default function parse(element, { document }) {
  // Find the correct tabs container
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Tab labels: all <li role="tab"> direct children of tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Tab panels: all elements with data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose table rows: header and one for each tab
  const rows = [];
  rows.push(['Tabs (tabs37)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    // Defensive: panel and content
    let content = '';
    if (tabPanels[i]) {
      // Prefer the article inside the tabPanel, else the tabPanel itself
      // We want to reference the existing content markup, not clone
      // The content is everything inside the tabPanel except the tabPanel wrapper
      // Typically inside .contentfragment > article > .cmp-contentfragment__elements
      const article = tabPanels[i].querySelector('article');
      if (article) {
        // For robustness, find the .cmp-contentfragment__elements inside article
        const mainContent = article.querySelector('.cmp-contentfragment__elements');
        if (mainContent) {
          content = mainContent;
        } else {
          content = article;
        }
      } else {
        // No article, fallback to panel's own content
        // Exclude tabPanel's own container, use children
        if (tabPanels[i].children.length === 1) {
          content = tabPanels[i].firstElementChild;
        } else {
          // Wrap all children in a div to group
          const div = document.createElement('div');
          Array.from(tabPanels[i].children).forEach(child => div.appendChild(child));
          content = div;
        }
      }
    }
    rows.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabsRoot with table
  tabsRoot.replaceWith(table);
}
