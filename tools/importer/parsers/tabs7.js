/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs element (AEM: cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (in order)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = tabList.querySelectorAll('.cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // Find all tabpanel elements (in order)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: if no panels, nothing to do
  if (tabPanels.length === 0) return;

  // Compose the header row: block name + tab labels
  const headerRow = ['Tabs (tabs7)', ...tabLabels];
  // Compose the content row: first cell empty (matches 2nd row in example), then tab content
  const contentRow = [''];
  tabPanels.forEach(tabPanel => {
    // Each tabPanel may have a wrapping contentfragment/article or a div.
    // We want to preserve all relevant content under the tabPanel as-is.
    // We'll collect all children as a DocumentFragment for that cell.
    const tabContentFragment = document.createDocumentFragment();
    // If the tabPanel has a single child and it's a .contentfragment, use that
    let contentRoot = tabPanel;
    if (
      tabPanel.childElementCount === 1 &&
      (
        tabPanel.firstElementChild.classList.contains('contentfragment') ||
        tabPanel.firstElementChild.classList.contains('cmp-contentfragment')
      )
    ) {
      contentRoot = tabPanel.firstElementChild;
    }
    // Transfer all child nodes into the fragment (preserving references)
    while (contentRoot.childNodes.length > 0) {
      tabContentFragment.appendChild(contentRoot.childNodes[0]);
    }
    contentRow.push(tabContentFragment);
  });

  // Create the block table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
