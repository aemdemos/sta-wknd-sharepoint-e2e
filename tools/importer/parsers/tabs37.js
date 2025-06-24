/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the given element
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Get the tab labels in order
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const panelIdToLabel = {};
  tabLis.forEach(li => {
    const panelId = li.getAttribute('aria-controls');
    if (panelId) {
      panelIdToLabel[panelId] = li.textContent.trim();
    }
  });

  // Get all tab panels in source order
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('[role="tabpanel"]'));

  // Build the table header row according to the requirements
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // Each tab row: [tabLabel, tabContent] (reference the whole content block)
  tabPanels.forEach(panel => {
    // Get this panel's label
    const label = panelIdToLabel[panel.id] || '';
    // For content: reference the main article if exists, otherwise the inner content of the panel
    let contentElem = null;
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      contentElem = article;
    } else {
      // fallback: use the entire panel contents
      contentElem = document.createElement('div');
      while (panel.firstChild) {
        contentElem.appendChild(panel.firstChild);
      }
    }
    rows.push([label, contentElem]);
  });

  // Create the Tabs block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs wrapper with our block table
  tabsWrapper.replaceWith(block);
}
