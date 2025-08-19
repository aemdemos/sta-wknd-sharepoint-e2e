/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the Tabs block within the provided element
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels from the tablist
  const tabList = cmpTabs.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li.cmp-tabs__tab'));

  // Extract corresponding tab panels (content sections)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare the header row exactly as required
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  // For each tab label and panel, add a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    let label = tabLabels[i].textContent.trim();
    let panel = tabPanels[i];

    let tabContent = '';
    if (panel) {
      // Find article or contentfragment if present, else take all content
      const article = panel.querySelector('article');
      if (article) {
        tabContent = article;
      } else {
        // If no article, use all children of the panel
        // But exclude elements with no real content (empty grid divs)
        const children = Array.from(panel.children).filter(child => {
          // Exclude empty grid wrappers
          if (
            child.classList.contains('aem-Grid') ||
            child.classList.contains('aem-Grid--12') ||
            child.classList.contains('aem-Grid--default--12') ||
            child.tagName === 'DIV' && child.children.length === 0 && child.textContent.trim() === ''
          ) {
            return false;
          }
          return true;
        });
        tabContent = children.length > 0 ? children : panel;
      }
    }
    rows.push([label, tabContent]);
  }

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsContainer.replaceWith(table);
}
