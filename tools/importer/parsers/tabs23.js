/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block inside the provided element
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Get tab label elements (li's inside .cmp-tabs__tablist)
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll(':scope > li')) : [];
  // Get the tab label text content
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Find all tabpanel elements in order
  const tabPanels = Array.from(tabsWrapper.querySelectorAll(':scope > .cmp-tabs__tabpanel'));
  // Fallback: if not found, check for any children that have .cmp-tabs__tabpanel
  if (tabPanels.length === 0) {
    tabPanels.push(
      ...Array.from(tabsWrapper.children).filter(el => el.classList && el.classList.contains('cmp-tabs__tabpanel'))
    );
  }

  // Compose header row as per requirements
  const headerRow = ['Tabs (tabs23)'];

  // Build rows: each row is [tab label, tab content]
  const rows = tabLabels.map((label, i) => {
    // For tab content, use the article, or all children if no article
    let content;
    const tabPanel = tabPanels[i];
    if (tabPanel) {
      const article = tabPanel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Filter out empty grid divs and whitespace
        content = Array.from(tabPanel.childNodes).filter(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && /aem-Grid/.test(node.className) && node.childElementCount === 0) return false;
            return true;
          } else if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.trim().length > 0;
          }
          return false;
        });
      }
    } else {
      content = '';
    }
    return [label, content];
  });

  // Compose the block table structure
  const cells = [
    headerRow,
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
