/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabLabelEls = tabsBlock.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // Find all tab panels (tabpanel)
  const tabPanelEls = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  if (tabPanelEls.length !== tabLabels.length) return;

  // Build table rows: first row is single header cell
  const cells = [['Tabs (tabs18)']];

  // Each tab becomes a row: [tab label, tab content]
  tabLabels.forEach((label, i) => {
    let content = tabPanelEls[i].querySelector('.cmp-contentfragment');
    if (!content) {
      // fallback: find meaningful content
      let meaningful = Array.from(tabPanelEls[i].children).filter(child => {
        if (child.classList.contains('aem-Grid') || (child.children.length === 0 && !child.textContent.trim())) return false;
        return true;
      });
      if (meaningful.length === 1) {
        content = meaningful[0];
      } else if (meaningful.length > 1) {
        const wrapper = document.createElement('div');
        meaningful.forEach(m => wrapper.appendChild(m));
        content = wrapper;
      } else {
        content = tabPanelEls[i];
      }
    }
    cells.push([label, content]);
  });

  // Create the table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
