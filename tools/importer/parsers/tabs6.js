/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (from the tab list)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabListItems = Array.from(tabList.children);
  const tabLabels = tabListItems.map(li => li.textContent.trim());

  // Get tab panels (in order, by id)
  // Tab panels have [data-cmp-hook-tabs="tabpanel"]
  const tabPanels = tabLabels.map((_, i) => {
    // Tab order should match li order
    // Each li's aria-controls points to the tabpanel's id
    const ariaControls = tabListItems[i].getAttribute('aria-controls');
    return tabsBlock.querySelector('#' + ariaControls);
  });

  // Defensive: only create rows for found panels
  const panelRows = tabPanels.map((panel, i) => {
    if (!panel) return [tabLabels[i], ''];
    // The tab content is the main contentfragment/article inside panel
    // Sometimes contentfragment is wrapped in a <div class="contentfragment"> or similar
    // We'll grab the <article> if present, else all children
    const article = panel.querySelector('article');
    if (article) {
      return [tabLabels[i], article];
    }
    // fallback: put panel's children in an array
    const contentEls = Array.from(panel.children);
    return [tabLabels[i], contentEls.length === 1 ? contentEls[0] : contentEls];
  });

  // Compose table rows
  const cells = [
    ['Tabs (tabs6)'], // header
    ...panelRows
  ];

  // Create table and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
