/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li's under ol[role=tablist])
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]'));
  if (!tabLabels.length) return;
  const labelTexts = tabLabels.map(tab => tab.textContent.trim());

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));
  if (!tabPanels.length) return;

  // For each panel, extract the tab content (as robustly as possible)
  const tabContents = tabPanels.map(tabPanel => {
    // Try to find a contentfragment/article inside this tabPanel
    let cf = tabPanel.querySelector('article') || tabPanel;
    // Try to find the content area
    let contentArea = cf.querySelector('.cmp-contentfragment__elements') || cf;

    // We'll collect all relevant children (paragraphs, images, lists, etc). Ignore empty structural divs.
    const items = [];
    Array.from(contentArea.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;
        // Skip grid wrappers that are empty
        if (
          el.classList &&
          (el.classList.contains('aem-Grid') ||
            el.querySelector('.aem-Grid'))
        ) {
          return;
        }
        // If wrapper div that just contains elements, flatten
        if (el.tagName === 'DIV' && el.children.length > 0) {
          Array.from(el.children).forEach(grand => {
            if (
              grand.classList &&
              (grand.classList.contains('aem-Grid') ||
                grand.querySelector('.aem-Grid'))
            ) {
              // skip empty grid structure
              return;
            }
            items.push(grand);
          });
        } else {
          items.push(el);
        }
      }
    });
    // Remove empty divs
    const filtered = items.filter(n => {
      return !(n.tagName === 'DIV' && n.textContent.trim() === '');
    });
    return filtered.length ? filtered : [contentArea];
  });

  // Build the table: first row (header), second row (tab labels), third row (tab contents)
  const cells = [];
  cells.push(['Tabs (tabs23)']); // Header row (single column)
  cells.push(labelTexts);        // Tab labels row (multiple columns)
  cells.push(tabContents);       // Tab contents row (multiple columns)

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
