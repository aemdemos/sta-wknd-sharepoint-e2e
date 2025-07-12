/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block: .cmp-tabs
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels (li's in tablist)
  const tabLabelEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find tab panels (by role or class)
  const tabPanelEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive check: skip if no tabs or panels
  if (tabLabelEls.length === 0 || tabPanelEls.length === 0) return;

  // Build header row (must match example exactly)
  const rows = [['Tabs (tabs3)']];

  // For each tab, create a row with [Label, Content]
  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i]?.textContent.trim() || '';
    // Find corresponding tab panel (same index)
    const panel = tabPanelEls[i];
    let content = '';
    if (panel) {
      // Find contentfragment/article for the panel, or fallback to all children except the tabpanel's script/style
      const article = panel.querySelector('article');
      if (article) {
        // Try to find .cmp-contentfragment__elements within the article (skip h3 title)
        const cfElements = article.querySelector('.cmp-contentfragment__elements');
        if (cfElements) {
          // Remove empty .aem-Grid wrappers only if they contain no content or images
          Array.from(cfElements.querySelectorAll('.aem-Grid')).forEach(grid => {
            if (!grid.textContent.trim() && !grid.querySelector('img')) grid.remove();
          });
          // If only one relevant child left, just put it in
          if (cfElements.childNodes.length === 1) {
            content = cfElements.firstChild;
          } else {
            // Otherwise, return all as an array
            content = Array.from(cfElements.childNodes).filter(n => {
              if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
              return true;
            });
          }
        } else {
          // fallback to the article element itself
          content = article;
        }
      } else {
        // fallback to all panel children
        content = Array.from(panel.childNodes).filter(n => {
          // skip empty text nodes, script/style
          if (n.nodeType === Node.ELEMENT_NODE && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE')) return false;
          if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
          return true;
        });
        if (content.length === 1) content = content[0];
      }
    }
    rows.push([label, content]);
  }
  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace tabsBlock with the new table
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
