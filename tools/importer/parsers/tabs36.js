/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels (li elements in .cmp-tabs__tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // Extract tab panels (divs with .cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Check that the number of tabs and panels match, but fill missing content with blank if needed
  const maxTabs = Math.max(tabLabels.length, tabPanels.length);

  // Prepare the header row as required
  const headerRow = ['Tabs (tabs36)'];

  // For each tab, create a row: [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < maxTabs; i++) {
    // Tab label (text)
    let labelContent = '';
    if (tabLabels[i]) {
      labelContent = tabLabels[i].textContent.trim();
    }
    // Tab content: grab the entire content inside the corresponding tabpanel (reference the .contentfragment/article if present, else the panel's children)
    let contentCell = '';
    if (tabPanels[i]) {
      // Prefer the contentfragment/article inside the tabpanel
      const cf = tabPanels[i].querySelector('article.cmp-contentfragment') || tabPanels[i].querySelector('.contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        // fallback: all children
        contentCell = Array.from(tabPanels[i].childNodes);
      }
    }
    rows.push([labelContent, contentCell]);
  }

  // The final table: header row, then one row per tab (label, content)
  const cells = [headerRow, ...rows];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.parentNode.replaceChild(block, element);
}
