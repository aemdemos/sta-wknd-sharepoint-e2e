/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block by class (should only be one immediate child with 'tabs' in class)
  const tabsBlock = Array.from(element.querySelectorAll(':scope > div')).find(el => el.classList.contains('tabs'));
  if (!tabsBlock) return;

  // Find the .cmp-tabs
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabEls = Array.from(tabList.querySelectorAll('li'));

  // Get all tabpanels (in DOM order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose rows: first row is header, subsequent rows are [label, content]
  const rows = [];
  rows.push(['Tabs (tabs34)']);

  // For each tab label, find corresponding panel
  tabEls.forEach((tabEl) => {
    const label = tabEl.textContent.trim();
    const ariaControls = tabEl.getAttribute('aria-controls');
    // Find panel with matching id
    const panelEl = tabPanels.find(panel => panel.id === ariaControls);
    if (!panelEl) return;
    // Find the main content to include for the tab content cell
    // Typically the contentfragment/article or whole tabpanel
    let tabContent;
    const article = panelEl.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // fallback to the entire panel content if article is missing
      tabContent = panelEl;
    }
    rows.push([label, tabContent]);
  });
  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
