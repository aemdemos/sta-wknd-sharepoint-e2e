/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element in the block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 1. Extract the tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabItems = tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : [];
  const tabLabels = Array.from(tabItems).map(tab => tab.textContent.trim());

  // 2. Extract the tab panels (content)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // 3. Set up the block table structure
  // Header row: block name as per requirements
  const rows = [['Tabs (tabs36)']];

  // Each tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    let contentElem = null;
    const panel = tabPanels[i];
    if (panel) {
      // Try to find the contentfragment, if present
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        contentElem = cf;
      } else {
        // Otherwise, use the panel's children as content
        // (don't include the panel container itself)
        const fragment = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(child => {
          fragment.appendChild(child);
        });
        contentElem = fragment;
      }
    } else {
      contentElem = '';
    }
    rows.push([label, contentElem]);
  }

  // 4. Create the table using the helper function
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace the tabs element with the new table
  tabs.replaceWith(table);
}
