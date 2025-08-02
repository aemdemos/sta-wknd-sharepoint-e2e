/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .cmp-tabs block (only one per source section)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find the tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelElements = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Find tabpanel elements (these hold the tab content)
  const tabPanelElements = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // The block requires:
  // - First row: header: Tabs (tabs13)
  // - Second row: tab labels (one column per tab)
  // - Each following row: tab content (one column per tab)

  // Build header - always exactly as the block name
  const headerRow = ['Tabs (tabs13)'];

  // Build tab label row
  const tabLabelRow = tabLabels;

  // Now extract tab content for each tab panel
  // For each panel, extract the direct content for that panel
  function extractTabContent(panel) {
    // Prefer .cmp-contentfragment__elements > [not .aem-Grid] for content
    const article = panel.querySelector('article');
    if (article) {
      const elements = article.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // We want to get all real content, skipping aem-Grid layout wrappers
        const contentNodes = [];
        elements.childNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList.contains('aem-Grid')) return;
            // If it's a <div> with aem-Grid, skip
            if (node.tagName === 'DIV' && node.children.length === 1 && node.children[0].classList.contains('aem-Grid')) return;
            // If it's a <div> with content, push its children except for .aem-Grid
            if (node.tagName === 'DIV') {
              Array.from(node.childNodes).forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE && child.classList.contains('aem-Grid')) return;
                contentNodes.push(child);
              });
            } else {
              contentNodes.push(node);
            }
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            // preserve significant text
            const span = document.createElement('span');
            span.textContent = node.textContent.trim();
            contentNodes.push(span);
          }
        });
        // Return as a flat array of elements/text
        // Filter out empty/whitespace
        const filtered = contentNodes.filter(n => {
          if (n.nodeType === Node.ELEMENT_NODE) {
            if (n.tagName === 'DIV' && n.childNodes.length === 0) return false;
            return true;
          }
          if (n.nodeType === Node.TEXT_NODE) {
            return n.textContent.trim().length > 0;
          }
          return true;
        });
        return filtered.length === 1 ? filtered[0] : filtered;
      } else {
        // Fallback: just use the article
        return article;
      }
    }
    // Fallback: all children from panel
    const fallback = Array.from(panel.childNodes).filter(n => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0) return true;
      return false;
    });
    return fallback.length === 1 ? fallback[0] : fallback;
  }

  // Each tab content row: content for one tab (must be one row per tab, one column per tab)
  // But in the example, each tab's content is in a separate row, with only one cell (per tab)
  // The correct structure is: header, tab labels, then for each tab, a row with the tab content in the corresponding cell and others empty
  // But the markdown shows the tab label row, then for each tab, a row where its content is in its column, others blank
  const rows = [headerRow, tabLabelRow];
  for (let i = 0; i < tabPanelElements.length; i++) {
    const row = [];
    for (let j = 0; j < tabPanelElements.length; j++) {
      if (i === j) {
        // Only in this column
        row.push(extractTabContent(tabPanelElements[j]));
      } else {
        row.push('');
      }
    }
    rows.push(row);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(table, element);
}
