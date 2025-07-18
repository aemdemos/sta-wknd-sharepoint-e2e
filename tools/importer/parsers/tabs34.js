/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cmp-tabs element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels and their order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabElems = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);
  const tabLabels = tabElems.map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose cells array
  const cells = [];
  // Header row must match the block name exactly
  cells.push(['Tabs (tabs34)']);

  // Each tab is a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Find panel by aria-labelledby matching tab id
    let contentElem = null;
    const tabElem = tabElems[i];
    if (tabElem && tabElem.id) {
      contentElem = tabPanels.find(
        d => d.getAttribute('aria-labelledby') === tabElem.id
      );
    }
    if (!contentElem && tabPanels[i]) contentElem = tabPanels[i];

    // For tab content: only the meaningful content, not the entire tabpanel div
    let tabContent = [];
    if (contentElem) {
      // Try to find the article (contentfragment), which contains the actual tab content
      // Only reference, do not clone
      const article = contentElem.querySelector('article');
      if (article) {
        tabContent = [article];
      } else {
        // fallback: all child nodes that are elements or non-empty text
        tabContent = Array.from(contentElem.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      }
    }
    if (tabContent.length === 1) tabContent = tabContent[0];
    cells.push([
      label,
      tabContent
    ]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
