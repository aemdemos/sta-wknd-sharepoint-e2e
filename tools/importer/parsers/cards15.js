/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment block for surf cards
  const fragment = element.querySelector('article.contentfragment');
  if (!fragment) return;
  const cardRoot = fragment.querySelector('.cmp-contentfragment__elements');
  if (!cardRoot) return;

  // Helper: Find the first image in a given node
  function findImageNode(el) {
    if (!el || !el.querySelector) return null;
    return el.querySelector('img');
  }

  // Helper: Compose text cell from heading and paragraph list
  function composeTextCell(title, descList) {
    const div = document.createElement('div');
    if (title) div.appendChild(title);
    descList.forEach(d => div.appendChild(d));
    return div;
  }

  // Prepare rows for table
  const rows = [['Cards (cards15)']];
  const children = Array.from(cardRoot.children);

  // Step 1: Find all card breaks (H2 tags)
  const cardIndices = [];
  children.forEach((child, idx) => {
    if (child.tagName === 'H2') cardIndices.push(idx);
  });

  // Step 2: Handle intro card (all elements before first H2)
  let introEnd = cardIndices.length > 0 ? cardIndices[0] : children.length;
  let introImg = null;
  let introTextEls = [];
  for (let i = 0; i < introEnd; i++) {
    const c = children[i];
    if (!introImg) introImg = findImageNode(c);
    if ((c.tagName === 'P' || c.tagName === 'DIV') && c.textContent.trim()) {
      introTextEls.push(c);
    }
  }
  if (introImg || introTextEls.length) {
    rows.push([introImg, composeTextCell(null, introTextEls)]);
  }

  // Step 3: For each card (from H2 to next H2), extract as row
  for (let ci = 0; ci < cardIndices.length; ci++) {
    const startIdx = cardIndices[ci];
    const endIdx = ci + 1 < cardIndices.length ? cardIndices[ci + 1] : children.length;
    let titleEl = children[startIdx];
    let imgEl = null;
    let descEls = [];
    for (let j = startIdx + 1; j < endIdx; j++) {
      const c = children[j];
      if (!imgEl) imgEl = findImageNode(c);
      if (c.tagName === 'P' && c.textContent.trim()) {
        descEls.push(c);
      }
    }
    rows.push([imgEl, composeTextCell(titleEl, descEls)]);
  }

  // Build table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  fragment.replaceWith(block);
}
