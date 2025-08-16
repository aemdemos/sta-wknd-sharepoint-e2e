/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block within the element
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the <li role="tab"> elements
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  if (tabLabelEls.length === 0) return;
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get tab panels in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Header row is always the block name exactly as specified
  const rows = [['Tabs (tabs18)']];
  // Second row: the tab labels
  rows.push(tabLabels);

  // For each panel, extract the content as a cell (reference the actual elements)
  tabPanels.forEach(panel => {
    // Try to find the cmp-contentfragment > .cmp-contentfragment__elements inside the panel for main content
    // We'll collect the main content (images, paragraphs, lists, headings, etc) as is, in document order
    let contentElements = [];
    const cfArticle = panel.querySelector('article.cmp-contentfragment');
    if (cfArticle) {
      const cfContent = cfArticle.querySelector('.cmp-contentfragment__elements');
      if (cfContent) {
        // Gather all meaningful descendants (skip grid containers that are empty)
        // Only include elements that are not empty placeholders
        const flatten = (el) => {
          let arr = [];
          el.childNodes.forEach(child => {
            if (child.nodeType === 1) {
              // element node
              // skip empty grid wrappers
              if (
                child.classList.contains('aem-Grid') ||
                child.classList.contains('aem-GridColumn')
              ) {
                // may hold content, but if empty, skip
                if (child.querySelector('img, p, h1, h2, h3, h4, h5, h6, ul, ol')) {
                  arr = arr.concat(flatten(child));
                }
              } else if (
                child.tagName === 'DIV' ||
                child.tagName === 'SECTION'
              ) {
                // recurse into DIV/SECTION
                arr = arr.concat(flatten(child));
              } else if (
                child.tagName === 'IMG' ||
                child.tagName === 'P' ||
                child.tagName.match(/^H[1-6]$/) ||
                child.tagName === 'UL' ||
                child.tagName === 'OL' ||
                child.classList.contains('image')
              ) {
                arr.push(child);
              } else {
                arr = arr.concat(flatten(child));
              }
            }
          });
          return arr;
        };
        const flattened = flatten(cfContent);
        // Only push elements that are not empty and not duplicate
        flattened.forEach((el) => {
          if (
            (el.tagName !== 'DIV' || el.querySelector('img, p, h1, h2, h3, h4, h5, h6, ul, ol')) &&
            !contentElements.includes(el)
          ) {
            contentElements.push(el);
          }
        });
      }
    }
    // Fallback: if nothing, put the whole panel
    if (contentElements.length === 0) {
      contentElements = Array.from(panel.childNodes).filter(n => n.nodeType === 1);
    }
    rows.push([contentElements]);
  });

  // Create the table block and replace tabsBlock
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
