/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (cmp-tabs)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];
  const tabLabels = tabEls.map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row: exactly one cell
  const table = [['Tabs (tabs28)']];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Some panels may not be in order, match using aria-labelledby
    const tabEl = tabEls[i];
    let panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === tabEl.id);
    // fallback: assume ordering
    if (!panel) panel = tabPanels[i];

    // Use the first element child of panel for content,
    // or all children wrapped in a div if multiple
    let contentElem = null;
    if (panel) {
      const children = Array.from(panel.children).filter(n => n.nodeType === 1);
      if (children.length === 1) {
        contentElem = children[0];
      } else if (children.length > 1) {
        const wrapper = document.createElement('div');
        children.forEach(child => wrapper.appendChild(child));
        contentElem = wrapper;
      } else {
        // fallback to panel innerHTML
        contentElem = document.createElement('div');
        contentElem.innerHTML = panel.innerHTML;
      }
    } else {
      contentElem = document.createElement('div');
    }

    // Each data row should be an array of two items: [label, contentElem]
    table.push([label, contentElem]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
