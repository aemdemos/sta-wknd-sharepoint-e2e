/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment for the surf spots article
  const cf = element.querySelector('.cmp-contentfragment--san-diego-surfspots');
  if (!cf) return;

  // Find the elements root with the sequence of h2/div/p nodes
  const elementsRoot = cf.querySelector('.cmp-contentfragment__elements');
  if (!elementsRoot) return;

  // Table header, must match example
  const cells = [['Cards (cards7)']];

  // We'll assemble an array of all content nodes
  const nodes = Array.from(elementsRoot.childNodes);
  // Defensive: skip leading intro <p> (article intro, not a card) and any non-card content
  let i = 0;
  while (i < nodes.length) {
    // Find next <h2>
    while (i < nodes.length && !(nodes[i].nodeType === 1 && nodes[i].tagName === 'H2')) i++;
    if (i >= nodes.length) break;
    const heading = nodes[i];
    i++;
    // Find next <div> with a .cmp-image__image inside
    let img = null;
    while (i < nodes.length && !(nodes[i].nodeType === 1 && nodes[i].tagName === 'DIV' && nodes[i].querySelector('.cmp-image__image'))) i++;
    if (i < nodes.length && nodes[i].tagName === 'DIV') {
      const foundImg = nodes[i].querySelector('.cmp-image__image');
      if (foundImg) img = foundImg;
      i++;
    }
    // Find next <p> (description)
    let desc = null;
    while (i < nodes.length && !(nodes[i].nodeType === 1 && nodes[i].tagName === 'P')) i++;
    if (i < nodes.length && nodes[i].tagName === 'P') {
      desc = nodes[i];
      i++;
    }
    // If we have both an image and a description, create a card row
    if (img && desc) {
      // The card text cell should include the heading and the description, preserving heading semantics
      cells.push([img, [heading, desc]]);
    }
  }

  // Only replace if we found at least one card
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    cf.replaceWith(table);
  }
}
