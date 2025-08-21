/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (li inside the tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []);

  // Build the header row: block name as a single cell
  const headerRow = ['Tabs (tabs18)'];

  // Build the tab label row as an array of <th> elements
  const tabLabelRow = tabLabels.map(label => {
    const th = document.createElement('th');
    th.textContent = label.textContent.trim();
    return th;
  });

  // Get the tab panels in order, using the tabpanel role (corresponds to tabLabels order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Build the content row: one cell per tab, matching order of tabLabels
  const tabContentRow = tabPanels.map(panel => {
    const cf = panel.querySelector('.cmp-contentfragment__elements');
    if (cf) {
      return cf;
    }
    // fallback: put all children into a fragment
    const frag = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach(n => {
      if (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== '')) {
        frag.appendChild(n);
      }
    });
    return frag;
  });

  // Assemble the table cells
  const cells = [];
  cells.push(headerRow); // first row: block name
  cells.push(tabLabelRow); // second row: tab labels as <th> elements
  cells.push(tabContentRow); // third row: tab contents

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  tabsBlock.replaceWith(table);
}
