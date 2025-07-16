/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels
  const tabList = tabs.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabelEls = tabList.querySelectorAll('li[role="tab"]');
  if (!tabLabelEls.length) return;

  // Collect all tab panels in the order of the tabs
  const tabPanels = Array.from(tabLabelEls).map(tabLabelEl => {
    const tabId = tabLabelEl.getAttribute('aria-controls');
    if (!tabId) return null;
    return tabs.querySelector(`#${tabId}`);
  });

  // Prepare the header row
  const headerRow = ['Tabs (tabs23)'];

  // Prepare the tab labels row
  const tabLabelsRow = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // Prepare the tab contents row
  const contentRow = tabPanels.map(panel => {
    if (!panel) return '';
    // Get the main content from the panel
    // Usually there's a .contentfragment > article
    let mainContent = null;
    const article = panel.querySelector('article');
    if (article) {
      mainContent = article;
    } else {
      // Fallback: get all children except empty divs
      // Remove empty .aem-Grid wrappers
      const contents = Array.from(panel.children).filter(child => {
        // skip script/style
        if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') return false;
        // skip empty grids
        if (child.classList.contains('aem-Grid') && child.children.length === 0) return false;
        return true;
      });
      if (contents.length === 1) {
        mainContent = contents[0];
      } else if (contents.length > 1) {
        mainContent = contents;
      }
    }
    return mainContent || '';
  });

  // Compose the cells: header, labels, content
  const cells = [
    headerRow,
    tabLabelsRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the cmp-tabs element with the block table
  tabs.replaceWith(block);
}
