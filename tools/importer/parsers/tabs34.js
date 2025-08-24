/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs inside the tabs block
  let tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) {
    tabsWrapper = element.querySelector('.cmp-tabs');
  }
  if (!tabsWrapper) return;

  // Get tab labels
  const tabLabelEls = tabsWrapper.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // Get tab panels (contents)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));

  // Start cells with a single header cell as per the example
  const cells = [ ['Tabs (tabs34)'] ];
  // Each tab row: [Label, Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let panel = tabPanels[i];
    let content;
    if (!panel) {
      content = document.createElement('div');
    } else {
      // Reference the main article (or all children if missing)
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Use all children for robustness
        const kids = Array.from(panel.childNodes).filter(n =>
          !(n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '')
        );
        content = kids.length === 1 ? kids[0] : kids;
      }
    }
    cells.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsWrapper.replaceWith(table);
}
