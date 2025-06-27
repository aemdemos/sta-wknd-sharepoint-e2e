/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (which holds the surf spots cards)
  const cf = element.querySelector('article.contentfragment');
  if (!cf) return;

  // Helper to get all direct children of a node that are elements
  function directChildren(parent) {
    return Array.from(parent.childNodes).filter(n => n.nodeType === 1);
  }

  // The contentfragment's inner structure
  // The cards are built from a sequence of: h2 (spot name), (optional div with image), p (description)
  const cfMain = cf.querySelector('.cmp-contentfragment__elements > div');
  if (!cfMain) return;

  const cells = [['Cards (cards33)']]; // header row
  // We'll process the children of cfMain in order
  const children = directChildren(cfMain);
  
  // Handle the intro card (before the first h2), which consists of an image + intro text
  // The intro image and paragraph are present before the first h2 ("Swami's")
  // The image is inside a .cmp-image (may be inside a .aem-Grid)
  let introImg = null;
  let introText = null;
  for (let c of children) {
    if (c.querySelector && c.querySelector('.cmp-image')) {
      introImg = c.querySelector('.cmp-image');
    }
    if (c.tagName === 'P') {
      introText = c;
      break;
    }
  }
  if (introImg && introText) {
    cells.push([introImg, introText]);
  }

  // Now handle all the other cards (each spot)
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (node.tagName === 'H2') {
      const title = node;
      let img = null;
      let desc = null;
      // Look ahead: maybe the next sibling is a div with aem-Grid containing an image
      if (
        children[i+1] &&
        children[i+1].tagName === 'DIV' &&
        children[i+1].querySelector('.cmp-image__image')
      ) {
        img = children[i+1].querySelector('.cmp-image');
        i++;
      }
      // Now, look for the next <p> for the description
      if (children[i+1] && children[i+1].tagName === 'P') {
        desc = children[i+1];
        i++;
      }
      // Compose the text cell: Heading + Description (reference existing elements only)
      const content = [];
      if (title) content.push(title);
      if (desc) content.push(desc);
      cells.push([img, content]);
    }
    i++;
  }

  // Only output table if at least 1 card is found (including intro)
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
