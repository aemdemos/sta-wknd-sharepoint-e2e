/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabelNodes = tabsBlock.querySelectorAll('.cmp-tabs__tablist > li');
  // Get tab panels
  const tabPanelNodes = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Defensive: must have equal number of labels and panels
  if (tabLabelNodes.length !== tabPanelNodes.length || tabLabelNodes.length === 0) return;

  // Header row should match block name
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  // For each tab, build a [label, content] row
  for (let i = 0; i < tabLabelNodes.length; i++) {
    const label = tabLabelNodes[i].textContent.trim();
    const panel = tabPanelNodes[i];
    // For content: use all children of the contentfragment/article inside the tabpanel, as a DocumentFragment
    let contentEl = panel.querySelector('article.cmp-contentfragment');
    let content;
    if (contentEl) {
      // Use its .cmp-contentfragment__elements children for content if available, else all children except title
      const elementsSection = contentEl.querySelector('.cmp-contentfragment__elements');
      if (elementsSection) {
        // Collect child nodes that are not just empty grids
        const filtered = Array.from(elementsSection.children).filter(child => {
          // skip empty aem-Grid wrappers
          if (child.classList.contains('aem-Grid')) return false;
          // skip empty wrappers with only grid children
          if (
            child.children.length === 1 &&
            child.firstElementChild &&
            child.firstElementChild.classList.contains('aem-Grid')
          ) return false;
          // skip <div> with only empty grid divs
          if (
            child.tagName === 'DIV' &&
            Array.from(child.children).every(
              c => c.classList.contains('aem-Grid') && c.children.length === 0
            )
          ) return false;
          return true;
        });
        // If nothing filtered, use .cmp-contentfragment__elements itself
        if (filtered.length) {
          content = filtered;
        } else {
          content = [elementsSection];
        }
      } else {
        // fallback to all children except h3.cmp-contentfragment__title
        content = Array.from(contentEl.children).filter(ch => !ch.classList.contains('cmp-contentfragment__title'));
      }
    } else {
      // fallback: use all children of panel
      content = Array.from(panel.children);
    }
    // Fall back to an empty text if no content
    if (!content || content.length === 0) {
      content = [''];
    }
    rows.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
