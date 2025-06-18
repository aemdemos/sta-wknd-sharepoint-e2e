/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero teaser block (direct descendant)
  const heroTeaser = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  let imgEl = null;
  let contentEls = [];

  // Helper: get the Node constructor from the document (ensures Node is defined in all environments)
  const NodeCtor = (document && document.defaultView && document.defaultView.Node) ? document.defaultView.Node : window.Node;

  if (heroTeaser) {
    // Find the image inside the hero
    const imgWrap = heroTeaser.querySelector('.cmp-teaser__image');
    if (imgWrap) {
      imgEl = imgWrap.querySelector('img');
    }
    // Find the heading/content inside the hero
    const contentWrap = heroTeaser.querySelector('.cmp-teaser__content');
    if (contentWrap) {
      contentEls = Array.from(contentWrap.childNodes).filter(node => {
        // skip empty text nodes
        if (node.nodeType === NodeCtor.TEXT_NODE && !node.textContent.trim()) return false;
        return true;
      });
    }
  }

  // Compose the hero table as per the example (header, image row, content row)
  const cells = [];
  cells.push(['Hero']);
  cells.push([imgEl ? imgEl : '']);
  // For the content row, include all contentEls, or an empty cell if none
  if (contentEls.length > 0) {
    // If single node, just that node, else an array
    cells.push([contentEls.length === 1 ? contentEls[0] : contentEls]);
  } else {
    cells.push(['']);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
