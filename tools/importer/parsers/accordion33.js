/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment/article containing the surf spots sections
  const cf = element.querySelector('article.contentfragment');
  if (!cf) return;
  const cfBody = cf.querySelector('.cmp-contentfragment__elements > div');
  if (!cfBody) return;

  // The example block is a single Accordion (accordion33) table, header row only
  const rows = [['Accordion (accordion33)']];

  // Helper: collect all top-level nodes in cfBody that are H2 and everything after until next H2
  const children = Array.from(cfBody.children);
  let i = 0;
  while (i < children.length) {
    if (children[i].tagName === 'H2') {
      const titleEl = children[i];
      i++;
      // collect all following siblings until next H2 or end
      let contentEls = [];
      while (i < children.length && children[i].tagName !== 'H2') {
        // Filter out empty .aem-Grid and empty divs
        if (
          !(children[i].classList && children[i].classList.contains('aem-Grid')) &&
          !(children[i].classList && children[i].classList.contains('aem-GridColumn')) &&
          // skip empty divs
          !(children[i].tagName === 'DIV' && children[i].children.length === 0 && children[i].textContent.trim() === '')
        ) {
          contentEls.push(children[i]);
        }
        i++;
      }
      // If only one element, use it directly. Otherwise, use the array.
      let contentCell = contentEls.length === 1 ? contentEls[0] : contentEls.length > 1 ? contentEls : '';
      rows.push([titleEl, contentCell]);
    } else {
      i++;
    }
  }

  // Only create the block if at least one accordion item was found
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    cf.replaceWith(block);
  }
}
