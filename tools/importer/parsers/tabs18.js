/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li[role="tab"])
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabHeaderEls = tablist ? tablist.querySelectorAll('li[role="tab"]') : [];
  // Build an array of tab label strings
  const tabLabels = Array.from(tabHeaderEls).map(tab => tab.textContent.trim());

  // Find the tab panels (div[role="tabpanel"])
  const tabpanelEls = tabsBlock.querySelectorAll('div[role="tabpanel"]');

  // Compose table rows: header, then one row for each tab (label, content)
  const cells = [['Tabs (tabs18)']];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let contentCell;
    if (tabpanelEls[i]) {
      // If there is a .cmp-contentfragment, just use that entire element (retains formatting, image, etc.)
      const cf = tabpanelEls[i].querySelector('.cmp-contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        // Otherwise, include all children as an array for robustness
        const children = Array.from(tabpanelEls[i].childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
        // Only use array if non-empty, else empty string
        contentCell = children.length ? children : '';
      }
    } else {
      contentCell = '';
    }
    cells.push([label, contentCell]);
  }
  // Create the table and replace the tabs block with it
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
