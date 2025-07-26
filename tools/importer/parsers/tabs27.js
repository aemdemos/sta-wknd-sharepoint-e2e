/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsSection = element.querySelector('.tabs');
  if (!tabsSection) return;
  const tabs = tabsSection.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in order
  const tabLabelEls = tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab');
  if (!tabLabelEls.length) return;
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // Get tab panels in the same order as tab labels
  const tabPanelEls = tabs.querySelectorAll('.cmp-tabs__tabpanel');
  if (tabPanelEls.length !== tabLabels.length) return;

  // Collect each tab's content in order
  const tabContents = tabLabels.map((_, i) => {
    const panel = tabPanelEls[i];
    if (!panel) return '';
    // Prefer contentfragment__elements if present
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
      return elements || contentFragment;
    }
    // fallback: use the panel's children
    const frag = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach(node => frag.appendChild(node));
    return frag;
  });

  // Table: header row (single cell), then a row of tab labels, then a row of tab contents
  const cells = [
    ['Tabs (tabs27)'],
    tabLabels,
    tabContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
