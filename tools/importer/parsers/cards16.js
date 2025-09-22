/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  // Find the main contentfragment
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // The cards are inside .cmp-contentfragment__elements
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Gather all children for traversal
  const children = Array.from(cfElements.children);

  // ---
  // 1. Find the intro card (before first h2): image + intro paragraph
  let introImage = null;
  let introDesc = null;
  let firstH2Idx = children.findIndex((c) => c.tagName && c.tagName.toLowerCase() === 'h2');
  for (let j = 0; j < firstH2Idx; j++) {
    if (!introImage && children[j].querySelector && children[j].querySelector('div.cmp-image')) {
      introImage = children[j].querySelector('div.cmp-image');
    }
    if (!introDesc && children[j].tagName && children[j].tagName.toLowerCase() === 'p') {
      introDesc = children[j];
    }
  }
  if (introImage && introDesc) {
    rows.push([introImage, introDesc]);
  }

  // ---
  // 2. Find all cards: pattern is h2 (title), image (optional), p (desc)
  let i = firstH2Idx;
  while (i < children.length) {
    // Title
    let titleElem = children[i];
    if (!titleElem || titleElem.tagName.toLowerCase() !== 'h2') { i++; continue; }
    let title = titleElem;
    i++;

    // Image (may be wrapped)
    let image = null;
    if (i < children.length && children[i].querySelector && children[i].querySelector('div.cmp-image')) {
      image = children[i].querySelector('div.cmp-image');
      i++;
    }

    // Description
    let desc = null;
    if (i < children.length && children[i].tagName && children[i].tagName.toLowerCase() === 'p') {
      desc = children[i];
      i++;
    }

    // Defensive: look ahead for image/desc if missing
    if (!image) {
      let j = i;
      while (j < children.length && children[j].tagName && children[j].tagName.toLowerCase() !== 'h2') {
        if (children[j].querySelector && children[j].querySelector('div.cmp-image')) {
          image = children[j].querySelector('div.cmp-image');
          break;
        }
        j++;
      }
    }
    if (!desc) {
      let j = i;
      while (j < children.length && children[j].tagName && children[j].tagName.toLowerCase() !== 'h2') {
        if (children[j].tagName && children[j].tagName.toLowerCase() === 'p') {
          desc = children[j];
          break;
        }
        j++;
      }
    }

    // Only add if both image and desc
    if (image && desc) {
      rows.push([
        image,
        [title, desc],
      ]);
    }
  }

  // Only output if there is at least one card row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
