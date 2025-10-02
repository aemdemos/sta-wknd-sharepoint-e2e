/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cf = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cf) return;
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Compose header row
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Helper to extract image from a wrapper
  function extractImage(wrapper) {
    const img = wrapper.querySelector('.cmp-image img');
    if (!img) return null;
    // Create a new <img> with src, alt, and title
    const newImg = document.createElement('img');
    newImg.src = img.src;
    if (img.alt) newImg.alt = img.alt;
    if (img.title) newImg.title = img.title;
    return newImg;
  }

  // Find all children in order
  const children = Array.from(cfElements.children);

  // First card: intro image + intro paragraph
  let introImg = null, introDesc = null;
  let introRowAdded = false;
  for (let i = 0; i < children.length; i++) {
    if (!introDesc && children[i].tagName === 'P') {
      introDesc = children[i];
    }
    if (!introImg && children[i].querySelector && children[i].querySelector('.cmp-image')) {
      introImg = extractImage(children[i]);
      if (introImg && introDesc && !introRowAdded) {
        rows.push([
          introImg,
          introDesc.cloneNode(true)
        ]);
        introRowAdded = true;
      }
    }
    if (introRowAdded) break;
  }

  // Remaining cards: each surf spot
  let i = 0;
  while (i < children.length) {
    if (children[i].tagName === 'H2') {
      const titleEl = children[i];
      let imgEl = null, descEl = null;
      // Look for image after h2
      if (
        children[i + 1] &&
        children[i + 1].querySelector &&
        children[i + 1].querySelector('.cmp-image')
      ) {
        imgEl = extractImage(children[i + 1]);
        i++;
      }
      // Look for description (p) after image/title
      if (children[i + 1] && children[i + 1].tagName === 'P') {
        descEl = children[i + 1];
        i++;
      }
      if (imgEl && descEl) {
        // Compose text cell: title (h2) + description (p)
        const textCell = document.createElement('div');
        textCell.appendChild(titleEl.cloneNode(true));
        textCell.appendChild(descEl.cloneNode(true));
        rows.push([
          imgEl,
          textCell
        ]);
      }
    }
    i++;
  }

  // Only create table if there are card rows
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the main contentfragment with the block
    cf.replaceWith(block);
  }
}
