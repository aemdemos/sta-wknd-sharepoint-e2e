/* global WebImporter */
export default function parse(element, { document }) {
  // Find main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels and panels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Header row: one column
  const cells = [['Tabs (tabs34)']];

  // Helper to determine if a node is an empty grid wrapper
  function isEmptyGridNode(node) {
    if (node.nodeType !== 1) return false;
    // Remove aem-Grid & aem-GridColumn wrappers with no meaningful children
    if (
      (node.classList.contains('aem-Grid') || node.classList.contains('aem-GridColumn')) &&
      node.children.length === 0
    ) return true;
    // aem-GridColumn or aem-Grid that only contain empty aem-Grid
    if ((node.classList.contains('aem-Grid') || node.classList.contains('aem-GridColumn')) && node.children.length > 0) {
      let allEmpty = true;
      Array.from(node.children).forEach(child => {
        if (!isEmptyGridNode(child)) allEmpty = false;
      });
      return allEmpty;
    }
    // div that only contains aem-Grid or aem-GridColumn and they're empty
    if (node.tagName === 'DIV' && node.children.length === 1) {
      const child = node.children[0];
      if (
        child.classList &&
        (child.classList.contains('aem-Grid') || child.classList.contains('aem-GridColumn')) &&
        isEmptyGridNode(child)
      ) {
        return true;
      }
    }
    return false;
  }

  // Get only meaningful (not empty grid) children
  function extractMeaningfulContent(nodes) {
    const out = [];
    nodes.forEach(node => {
      // skip text nodes that are empty
      if (node.nodeType === 3 && !node.textContent.trim()) return;
      // skip empty grid wrappers
      if (node.nodeType === 1 && isEmptyGridNode(node)) return;
      // If it's a DIV and all of its children are empty grid nodes, skip
      if (node.nodeType === 1 && node.tagName === 'DIV') {
        const meaningful = extractMeaningfulContent(Array.from(node.childNodes));
        if (meaningful.length > 0) {
          // Make a shallow clone div (preserve attributes)
          const div = document.createElement('div');
          for (const attr of node.attributes) {
            div.setAttribute(attr.name, attr.value);
          }
          meaningful.forEach(child => div.append(child));
          out.push(div);
        }
        return;
      }
      out.push(node);
    });
    return out;
  }

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let tabContentElements = [];
    // Find the main article/contentfragment inside this tab
    const contentFragment = panel.querySelector('article');
    if (contentFragment) {
      const elementsDiv = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elementsDiv) {
        tabContentElements = extractMeaningfulContent(Array.from(elementsDiv.childNodes));
      }
      // fallback to article children if above fails
      if (tabContentElements.length === 0) {
        tabContentElements = extractMeaningfulContent(Array.from(contentFragment.childNodes).filter(node => {
          if (node.nodeType === 1 && node.classList && node.classList.contains('cmp-contentfragment__title')) return false;
          return true;
        }));
      }
    }
    // fallback to all panel children if still empty
    if (tabContentElements.length === 0) {
      tabContentElements = extractMeaningfulContent(Array.from(panel.childNodes));
    }
    if (tabContentElements.length === 0) tabContentElements = [''];
    cells.push([label, tabContentElements]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
