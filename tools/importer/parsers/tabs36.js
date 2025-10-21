/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  let cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (order should match labels)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Build rows: header first
  const rows = [['Tabs (tabs36)']];

  // For each tab, extract label and content
  tabLabels.forEach((labelEl, i) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[i];
    if (!panel) return;
    let content = null;
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      content = panel;
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
