/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to collect all accordion items (h2 + content)
  function extractAccordionItems(root) {
    const items = [];
    // Collect all top-level children (h2 for section, p, div.image, etc.)
    const children = Array.from(root.children);
    let i = 0;
    while (i < children.length) {
      const node = children[i];
      if (node.tagName === 'H2') {
        const title = node;
        // Collect all siblings until the next H2 or end
        const contentNodes = [];
        i++;
        while (
          i < children.length &&
          children[i].tagName !== 'H2'
        ) {
          const c = children[i];
          // skip empty .aem-Grid wrappers
          if (
            c.tagName === 'DIV' &&
            c.classList.contains('aem-Grid') &&
            c.children.length === 0
          ) {
            // skip
          } else {
            contentNodes.push(c);
          }
          i++;
        }
        items.push({ title, content: contentNodes });
      } else {
        i++;
      }
    }
    return items;
  }

  // Find the article.cmp-contentfragment (with actual H2s)
  const cfArticle = element.querySelector('article.cmp-contentfragment');
  if (!cfArticle) return;
  // The inner content block with the H2s, etc. is a div.cmp-contentfragment__elements > div
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Find the main content div with H2s, p, images, ...
  // Usually the 2nd div inside .cmp-contentfragment__elements
  const candidateDivs = Array.from(cfElements.children).filter(c => c.tagName === 'DIV');
  let mainContentDiv = null;
  if (candidateDivs.length > 1) {
    mainContentDiv = candidateDivs[1];
  } else {
    mainContentDiv = candidateDivs[0];
  }
  if (!mainContentDiv) return;

  // Now assemble the accordion items
  const accordionItems = extractAccordionItems(mainContentDiv);

  // Compose the table rows
  const rows = [
    ['Accordion (accordion15)']
  ];
  accordionItems.forEach(item => {
    let titleCell = item.title;
    let contentCell;
    if (item.content.length === 1) {
      contentCell = item.content[0];
    } else if (item.content.length > 1) {
      contentCell = item.content;
    } else {
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the cmp-contentfragment block (entire article) with accordion table
  cfArticle.replaceWith(table);
}
