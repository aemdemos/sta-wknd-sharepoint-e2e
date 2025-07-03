/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class 'cmp-tabs'
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from the tab list
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;

  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (tabLabels.length === 0) return;
  
  // Extract tab panels: order should match the order of tab labels
  // We'll use aria-controls to match tab to panel
  const tabPanels = tabLabels.map(tab => {
    const controls = tab.getAttribute('aria-controls');
    if (!controls) return null;
    const panel = tabsBlock.querySelector(`#${controls}`);
    return panel || null;
  });

  // If any panel is missing, skip it
  // Must have at least one valid pair
  if (!tabPanels.some(Boolean)) return;

  // Compose the table rows
  const headerRow = ['Tabs (tabs15)'];
  const labelRow = tabLabels.map(tab => tab.textContent.trim());
  // Each tab's content is the article or contentfragment element inside the panel
  const contentRow = tabPanels.map(panel => {
    if (!panel) return '';
    // Prefer .contentfragment > article, fallback to panel children
    let content;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      const article = cf.querySelector('article');
      if (article) {
        content = article;
      } else {
        // fallback to contentfragment
        content = cf;
      }
    } else {
      // fallback to panel's children
      // Create a fragment to hold all children
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(n => frag.appendChild(n));
      content = frag;
    }
    return content;
  });

  // Compose cells as per the example: header, labels, content
  const cells = [
    headerRow,
    labelRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
