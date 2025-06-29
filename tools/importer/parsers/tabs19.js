/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels from the tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tablist ? Array.from(tablist.querySelectorAll('li')) : [];
  const tabLabels = tabLabelEls.map(el => el.textContent.trim());

  // Extract all tabpanel elements
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Helper function to extract main content for each tab
  function extractTabContent(panel) {
    // Try to find a single main content container (prefer .cmp-contentfragment__elements)
    let fragment = panel.querySelector('.cmp-contentfragment') || panel.querySelector('article.cmp-contentfragment');
    if (fragment) {
      const elements = fragment.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // Try to avoid wrapper divs with no real content
        // Remove .aem-Grid or empty divs if possible
        // But keep actual content blocks
        // We'll just return elements, which may have wrappers, as that's logistically safest
        return elements;
      } else {
        return fragment;
      }
    } else {
      // Fallback: use the whole panel
      return panel;
    }
  }

  // Compose table rows: header, tab label header, tab content
  const headerRow = ['Tabs (tabs19)']; // block name as required
  // The tab label header row should be a single array of th elements, which createTable will treat as headers
  const tabLabelsHeaderRow = tabLabels.map(label => {
    const th = document.createElement('th');
    th.textContent = label;
    return th;
  });
  // The tab content row should be a single array of the tab contents (tds)
  const tabContentRow = tabPanels.map(extractTabContent);

  // Combine into the cells array
  const cells = [headerRow, tabLabelsHeaderRow, tabContentRow];

  // Create the structured block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
