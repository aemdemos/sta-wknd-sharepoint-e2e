/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (the block to convert)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels (li elements)
  const tabLabelEls = tabs.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // Extract tab panels (divs with cmp-tabs__tabpanel)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Prepare table header row (exactly as requested)
  const cells = [['Tabs (tabs6)']];

  // For each tab, create a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentEl = null;
    if (panel) {
      // Find main content inside panel -- prefer .cmp-contentfragment__elements, else all direct children of panel
      const contentFragment = panel.querySelector('.cmp-contentfragment__elements');
      if (contentFragment) {
        // Gather only non-empty and non-grid children
        const children = Array.from(contentFragment.childNodes).filter(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Ignore aem-Grid wrappers
            if (node.classList.contains('aem-Grid')) return false;
            // Ignore empty divs
            if (node.tagName === 'DIV' && node.childNodes.length === 0) return false;
          }
          if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
          return true;
        });
        // If only one, return that element; if multiple, array
        contentEl = children.length === 1 ? children[0] : children;
        // If nothing found, fallback
        if (!contentEl || (Array.isArray(contentEl) && contentEl.length === 0)) {
          // fallback to article
          const article = panel.querySelector('article');
          if (article) {
            contentEl = article;
          } else {
            // fallback to all panel children
            const panelKids = Array.from(panel.childNodes).filter(node => {
              if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('aem-Grid')) return false;
              if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
              return true;
            });
            contentEl = panelKids.length === 1 ? panelKids[0] : panelKids;
          }
        }
      } else {
        // fallback to article inside panel
        const article = panel.querySelector('article');
        if (article) {
          contentEl = article;
        } else {
          // fallback to children of panel
          const panelKids = Array.from(panel.childNodes).filter(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('aem-Grid')) return false;
            if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
            return true;
          });
          contentEl = panelKids.length === 1 ? panelKids[0] : panelKids;
        }
      }
    }
    // Add row: [Tab Label, Content]
    cells.push([label, contentEl]);
  }

  // Create table using the helper and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(table);
}
