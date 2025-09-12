/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment block
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main content area inside the contentfragment
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get all children nodes
  const children = Array.from(cfElements.childNodes).filter(n => n.nodeType === 1);

  // Prepare header row
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  // Helper to extract image from a .cmp-image block
  function extractImage(node) {
    if (!node) return '';
    if (node.classList && node.classList.contains('cmp-image')) return node;
    if (node.querySelector) {
      const img = node.querySelector('.cmp-image');
      if (img) return img;
    }
    return '';
  }

  // Special: intro card before first <h2>
  let introImage = '';
  let introText = [];
  for (let j = 0; j < children.length; j++) {
    if (children[j].tagName === 'H2') break;
    if (!introImage && extractImage(children[j])) {
      introImage = extractImage(children[j]);
    }
    if (children[j].tagName === 'P') {
      introText.push(children[j]);
    }
  }
  if (introImage && introText.length) {
    rows.push([introImage, introText]);
  }

  // Find all card blocks: each card starts with an <h2>
  let i = 0;
  while (i < children.length) {
    // Find next <h2>
    while (i < children.length && children[i].tagName !== 'H2') i++;
    if (i >= children.length) break;
    const titleNode = children[i];
    i++;

    // Look ahead for image block (div containing .cmp-image)
    let imageNode = '';
    let lookahead = i;
    while (lookahead < children.length) {
      const node = children[lookahead];
      if (extractImage(node)) {
        imageNode = extractImage(node);
        lookahead++;
        break;
      }
      // Stop if we hit another <h2> or <p>
      if (node.tagName === 'H2' || node.tagName === 'P') break;
      lookahead++;
    }
    i = lookahead;

    // Find next <p> for description
    let descNode = null;
    while (i < children.length && children[i].tagName !== 'P') i++;
    if (i < children.length && children[i].tagName === 'P') {
      descNode = children[i];
      i++;
    }

    // Compose card row
    const textCell = [];
    if (titleNode) textCell.push(titleNode);
    if (descNode) textCell.push(descNode);
    if (imageNode || textCell.length) {
      rows.push([imageNode, textCell]);
    }
  }

  // Only output if we have at least one card row
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    contentFragment.replaceWith(block);
  }
}
