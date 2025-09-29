/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cfArticle = element.querySelector('.cmp-contentfragment');
  if (!cfArticle) return;
  const elementsContainer = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Find all card sections: each starts with an h2, may have image, then a p
  const children = Array.from(elementsContainer.children);
  const rows = [ ['Cards (cards34)'] ]; // header row
  let i = 0;
  while (i < children.length) {
    if (children[i].tagName === 'H2') {
      const titleEl = children[i];
      let imageEl = null;
      let descEl = null;
      let j = i + 1;
      // Check for image block after h2
      if (
        children[j] &&
        children[j].querySelector &&
        children[j].querySelector('.cmp-image')
      ) {
        imageEl = children[j].querySelector('.cmp-image');
        j++;
      }
      // Check for paragraph after image
      if (children[j] && children[j].tagName === 'P') {
        descEl = children[j];
        j++;
      }
      // Compose text cell: title (h4) + description
      if (descEl) {
        const textCell = document.createElement('div');
        const heading = document.createElement('h4');
        heading.textContent = titleEl.textContent;
        textCell.appendChild(heading);
        textCell.appendChild(descEl.cloneNode(true));
        // Always clone the image node if present
        rows.push([
          imageEl ? imageEl.cloneNode(true) : '',
          textCell
        ]);
      }
      i = j;
    } else {
      i++;
    }
  }

  // Only replace if there are card rows
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the contentfragment element itself (not the root element)
    cfArticle.replaceWith(block);
  }
}
