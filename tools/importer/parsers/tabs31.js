/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main .tabs block
  const tabsDiv = element.querySelector('.tabs');
  if (!tabsDiv) return;
  const cmpTabs = tabsDiv.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels from the tablist
  const tablist = cmpTabs.querySelector('.cmp-tabs__tablist');
  const labelEls = tablist ? Array.from(tablist.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = labelEls.map(tab => tab.textContent.trim());

  // Extract all tab panels in appearance order
  const panelEls = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // Ensure we have one panel per label
  while (panelEls.length < tabLabels.length) {
    panelEls.push(document.createElement('div'));
  }

  // For each panel, extract the main content fragment/article, or fallback to panel div itself.
  const contentEls = panelEls.map(panel => {
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) return article;
    // Remove aria/role attributes for cleanliness
    panel.removeAttribute('aria-labelledby');
    panel.removeAttribute('aria-hidden');
    panel.removeAttribute('role');
    panel.removeAttribute('tabindex');
    return panel;
  });

  // Build the block table: header row, then one row per tab [tab label, tab content]
  const cells = [['Tabs (tabs31)']];
  tabLabels.forEach((label, i) => {
    cells.push([label, contentEls[i]]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabsDiv with the new block table
  tabsDiv.replaceWith(block);
}
