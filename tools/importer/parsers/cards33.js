/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main article contentfragment block
  const contentFragment = element.querySelector('article.contentfragment .cmp-contentfragment__elements');
  if (!contentFragment) return;

  // Collect all children from the content fragment
  const children = Array.from(contentFragment.children);

  // Find indices of image wrappers (cards always have images)
  const imageIndices = children
    .map((child, idx) => child.querySelector && child.querySelector('.cmp-image__image') ? idx : -1)
    .filter(idx => idx !== -1);

  // Compose rows as [img, [title (strong), br, desc]]
  const rows = [];
  imageIndices.forEach((imgIdx) => {
    const imageWrapper = children[imgIdx].querySelector('.cmp-image');

    // Try to find heading (title) and paragraph (desc) associated with image
    let titleEl = null;
    let descEl = null;

    // Usually title comes before image, description after
    // Seek heading before or after image
    // Forward search
    for (let k = imgIdx + 1; k < children.length; k++) {
      if (/^H[2-6]$/.test(children[k].tagName)) {
        titleEl = children[k];
        break;
      }
    }
    // If not found forward, search backward
    if (!titleEl) {
      for (let k = imgIdx - 1; k >= 0; k--) {
        if (/^H[2-6]$/.test(children[k].tagName)) {
          titleEl = children[k];
          break;
        }
      }
    }

    // Description: next paragraph after image or after title
    let descStart = titleEl ? children.indexOf(titleEl) + 1 : imgIdx + 1;
    for (let k = descStart; k < children.length; k++) {
      if (children[k].tagName === 'P') {
        descEl = children[k];
        break;
      }
    }
    // If not found forward, search backward
    if (!descEl) {
      for (let k = imgIdx - 1; k >= 0; k--) {
        if (children[k].tagName === 'P') {
          descEl = children[k];
          break;
        }
      }
    }

    // Compose text cell
    const textCell = [];
    if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent;
      textCell.push(strong);
    }
    if (descEl) {
      if (titleEl) textCell.push(document.createElement('br'));
      textCell.push(descEl);
    }
    // If no description, ensure all text after image until next heading/image is included
    if (!descEl) {
      let extra = [];
      let probeIdx = imgIdx + 1;
      while (probeIdx < children.length) {
        const probe = children[probeIdx];
        if (/^H[2-6]$/.test(probe.tagName) || (probe.querySelector && probe.querySelector('.cmp-image__image'))) break;
        if (probe.tagName === 'P') extra.push(probe);
        probeIdx++;
      }
      if (extra.length) {
        if (titleEl) textCell.push(document.createElement('br'));
        textCell.push(...extra);
      }
    }

    // Only add to rows if we have image AND at least some text
    if (imageWrapper && textCell.length) {
      rows.push([imageWrapper, textCell]);
    }
  });

  // Always use the header from the example, exactly
  const headerRow = ['Cards (cards33)'];

  // Only build and replace if there's at least one card
  if (rows.length) {
    const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
    element.replaceWith(table);
  }
}
