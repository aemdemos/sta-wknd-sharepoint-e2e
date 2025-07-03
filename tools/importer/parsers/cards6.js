/* global WebImporter */
export default function parse(element, { document }) {
  // Find the contentfragment component
  const cf = element.querySelector('.contentfragment .cmp-contentfragment');
  if (!cf) return;
  const els = cf.querySelector('.cmp-contentfragment__elements');
  if (!els) return;
  // Get all direct children (preserving all meaningful content and structure)
  const children = Array.from(els.childNodes).filter(node => {
    // Filter out empty text nodes
    return node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '';
  });
  // Helper: Find the first descendant .cmp-image in a node
  function findImage(node) {
    if (node && node.querySelector) {
      return node.querySelector('.cmp-image');
    }
    return null;
  }
  // Helper: Compose text cell: <strong>title</strong><br>description
  function composeTextCell(title, desc) {
    const strong = document.createElement('strong');
    strong.textContent = title.textContent;
    return [strong, document.createElement('br'), desc];
  }
  const rows = [['Cards (cards6)']];
  // Find intro image + description (before first h2)
  let i = 0;
  let introImg = null, introDesc = null;
  while (i < children.length && !(children[i].tagName && children[i].tagName.toUpperCase() === 'H2')) {
    if (!introImg && children[i].nodeType === Node.ELEMENT_NODE) {
      const img = findImage(children[i]);
      if (img) introImg = img;
    }
    if (!introDesc && children[i].tagName === 'P') {
      introDesc = children[i];
    }
    i++;
  }
  if (introImg && introDesc) {
    rows.push([introImg, introDesc]);
  }
  // Now parse each card (H2, optionally image, always paragraph)
  while (i < children.length) {
    const node = children[i];
    if (node.tagName && node.tagName.toUpperCase() === 'H2') {
      const title = node;
      let j = i + 1;
      let img = null;
      // Check next for image (in div with .cmp-image)
      if (j < children.length) {
        const possibleImg = findImage(children[j]);
        if (possibleImg) {
          img = possibleImg;
          j++;
        }
      }
      // Find the description paragraph (next after image or title)
      let desc = null;
      if (j < children.length && children[j].tagName === 'P') {
        desc = children[j];
        j++;
      }
      if (desc) {
        const cell = composeTextCell(title, desc);
        rows.push([img ? img : '', cell]);
      }
      i = j;
    } else {
      i++;
    }
  }
  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
