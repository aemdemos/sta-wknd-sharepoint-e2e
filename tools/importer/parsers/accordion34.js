/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment, which holds the accordion sections
  const cf = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!cf) return;

  // The contentfragment elements wrapper
  const cfEls = cf.querySelector('.cmp-contentfragment__elements') || cf;
  // Get all direct children (including H2s, Ps, DIVs for images)
  const children = Array.from(cfEls.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);

  // To collect accordion rows
  const rows = [];
  let i = 0;
  while (i < children.length) {
    // Titles are always <h2> and mark a new accordion item
    let curr = children[i];
    if (curr.tagName === 'H2') {
      const title = curr;
      i++;
      let contentNodes = [];
      // Gather all content until the next <h2> or end
      while (i < children.length && children[i].tagName !== 'H2') {
        const n = children[i];
        // Only push non-empty nodes
        if (
          n.tagName === 'P' || 
          (n.tagName === 'DIV' && n.querySelector('.cmp-image'))
        ) {
          contentNodes.push(n);
        }
        i++;
      }
      if (contentNodes.length === 0) {
        // If for some reason there's no content, fallback to an empty string
        contentNodes = [''];
      }
      // If only one node, flatten for cleaner cells
      rows.push([title, contentNodes.length === 1 ? contentNodes[0] : contentNodes]);
    } else {
      i++;
    }
  }
  // Only build if we have rows
  if (rows.length > 0) {
    const cells = [
      ['Accordion (accordion34)'],
      ...rows
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
