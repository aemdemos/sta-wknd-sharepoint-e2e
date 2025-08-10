/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabsWrapper = Array.from(element.querySelectorAll(':scope > div')).find(div =>
    div.classList.contains('tabs') && div.querySelector('.cmp-tabs')
  );
  if (!tabsWrapper) return;
  const tabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach((li) => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract tab contents (each cell should be the panel content, in order)
  const tabPanels = [];
  tabs.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
    // Get all element children (skipping empty text nodes)
    const nodes = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    if (nodes.length === 1) {
      tabPanels.push(nodes[0]);
    } else if (nodes.length > 1) {
      // Group multiple nodes in a DocumentFragment (to avoid unnecessary <div>)
      const frag = document.createDocumentFragment();
      nodes.forEach(n => frag.appendChild(n));
      tabPanels.push(frag);
    } else {
      tabPanels.push(document.createTextNode(''));
    }
  });

  // Compose table as: header row (one cell), tab labels row (one per label), tab content row (one per content)
  const headerRow = ['Tabs (tabs36)'];
  const cells = [
    headerRow,
    tabLabels,
    tabPanels
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsWrapper.replaceWith(table);
}
