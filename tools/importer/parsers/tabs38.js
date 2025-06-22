/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels from <li> inside .cmp-tabs__tablist
  const tabLabels = [];
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Find all tabpanels (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose the table rows
  // Header row:
  const rows = [];
  rows.push(['Tabs (tabs38)']); // header row (exactly one column)

  // Each tab is a row: [Label, Content Element]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Reference the actual article element (do not clone!)
    let contentNode = null;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      const article = cf.querySelector('article');
      contentNode = article ? article : cf;
    } else {
      // fallback to the panel itself if it contains meaningful nodes
      if (panel.childNodes.length > 0) {
        contentNode = panel;
      } else {
        continue;
      }
    }
    rows.push([label, contentNode]); // tab row: label and content (2 columns)
  }

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
