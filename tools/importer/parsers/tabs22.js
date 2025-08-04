/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (.cmp-tabs inside .tabs)
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Get tab list and panel list
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = tabList.querySelectorAll('li[role="tab"]');
  const tabPanels = tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel');

  // Build header row as required by spec
  const rows = [['Tabs (tabs22)']];

  // For each tab, get its label and associated content
  tabLabelEls.forEach(tabLabelEl => {
    const label = tabLabelEl.textContent.trim();
    const tabPanelId = tabLabelEl.getAttribute('aria-controls');
    // Find the corresponding tabpanel by id
    let contentCell = '';
    for (const panel of tabPanels) {
      if (panel.id === tabPanelId) {
        // Find the main article or content block inside the panel
        // If there is an article (cmp-contentfragment) use it directly
        const article = panel.querySelector('article');
        if (article) {
          contentCell = article;
        } else {
          // Fallback: use the panel contents
          contentCell = panel;
        }
        break;
      }
    }
    rows.push([label, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the entire tabs block with the table
  tabsWrapper.replaceWith(table);
}
