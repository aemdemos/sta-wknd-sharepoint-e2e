/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cf = element.querySelector('article.contentfragment');
  if (!cf) return;

  // Find the inner contentfragment article
  const cfArticle = cf.querySelector('article.cmp-contentfragment');
  if (!cfArticle) return;

  // The block header
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Find the main content container inside the contentfragment
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Helper to find the first .cmp-image inside a node
  function findImage(node) {
    if (!node) return null;
    if (node.classList && node.classList.contains('cmp-image')) return node;
    return node.querySelector && node.querySelector('.cmp-image');
  }

  // Helper to wrap multiple nodes in a div (for the text cell)
  function wrapNodes(nodes) {
    if (nodes.length === 1) return nodes[0];
    const div = document.createElement('div');
    nodes.forEach(n => div.appendChild(n));
    return div;
  }

  // Parse all children of cfElements
  const children = Array.from(cfElements.children);
  let i = 0;

  // --- First card: intro image + intro paragraph ---
  let introImage = null;
  let introTextNodes = [];
  while (i < children.length) {
    const node = children[i];
    if (node.tagName === 'H2') break;
    if (!introImage) introImage = findImage(node);
    if (node.tagName === 'P') introTextNodes.push(node);
    i++;
  }
  if (introImage && introTextNodes.length) {
    rows.push([introImage, wrapNodes(introTextNodes)]);
  }

  // --- Remaining cards: each starts with <h2> ---
  while (i < children.length) {
    if (children[i].tagName !== 'H2') { i++; continue; }
    const title = children[i];
    i++;
    // Possible image
    let image = null;
    // Look ahead for image in next sibling (could be wrapped)
    if (i < children.length) {
      image = findImage(children[i]);
      if (image) i++;
    }
    // Description paragraph
    let desc = null;
    if (i < children.length && children[i].tagName === 'P') {
      desc = children[i];
      i++;
    }
    // Compose text cell
    const textNodes = [];
    if (title) textNodes.push(title);
    if (desc) textNodes.push(desc);
    if (image && textNodes.length) {
      rows.push([image, wrapNodes(textNodes)]);
    }
  }

  // Only replace if we have at least one card row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    cf.replaceWith(table);
  }
}
