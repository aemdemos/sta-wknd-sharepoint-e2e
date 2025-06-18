/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Extract Tab Labels (as elements)
  const tabList = tabs.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = tabList
    ? Array.from(tabList.querySelectorAll('li.cmp-tabs__tab')).map(li => {
        const strong = document.createElement('b');
        strong.textContent = li.textContent.trim();
        return strong;
      })
    : [];

  // Extract Panel content, for each panel in order
  const panelNodes = Array.from(tabs.querySelectorAll('div.cmp-tabs__tabpanel'));
  const panelsContent = panelNodes.map(panel => {
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      const elements = article.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        const content = [];
        Array.from(elements.childNodes).forEach(node => {
          if (
            node.nodeType === 1 &&
            node.matches('div') &&
            node.childElementCount === 1 &&
            node.firstElementChild && node.firstElementChild.className &&
            node.firstElementChild.className.includes('aem-Grid')
          ) {
            return;
          }
          if (
            node.nodeType === 1 &&
            node.classList &&
            Array.from(node.classList).some(cls => cls.startsWith('aem-Grid'))
          ) {
            return;
          }
          content.push(node);
        });
        if (content.length === 1) return content[0];
        if (content.length > 1) return content;
      }
      return article;
    }
    return panel;
  });

  // Table structure: header row, then one row per tab (label, content)
  const cells = [
    ['Tabs (tabs34)'],
    ...tabLabels.map((label, i) => [label, panelsContent[i] || ''])
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.querySelector('.tabs').replaceWith(table);
}
