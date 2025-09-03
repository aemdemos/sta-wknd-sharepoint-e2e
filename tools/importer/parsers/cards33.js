/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content fragment article
  const cf = element.querySelector('article.cmp-contentfragment');
  if (!cf) return;
  // The main content is inside .cmp-contentfragment__elements > div (the second one)
  const elementsWrap = cf.querySelector('.cmp-contentfragment__elements');
  if (!elementsWrap) return;
  // Find the div that contains the cards (skip the intro p)
  // The structure is: <div> <p>intro</p> <div>...</div> <h2>...</h2> ... </div>
  // We'll use the second div inside .cmp-contentfragment__elements
  const contentDivs = Array.from(elementsWrap.children).filter(c => c.tagName === 'DIV');
  // Defensive: find the div with at least one h2
  let cardsRoot = null;
  for (const d of contentDivs) {
    if (d.querySelector('h2')) {
      cardsRoot = d;
      break;
    }
  }
  // If not found, fallback to the last div
  if (!cardsRoot && contentDivs.length > 0) {
    cardsRoot = contentDivs[contentDivs.length - 1];
  }
  if (!cardsRoot) return;

  // More flexible card extraction: walk through all children, collect cards
  const cards = [];
  const children = Array.from(cardsRoot.children);
  let i = 0;
  while (i < children.length) {
    // Find next h2 (card title)
    while (i < children.length && children[i].tagName !== 'H2') i++;
    if (i >= children.length) break;
    const h2 = children[i];
    i++;
    // Next, look for image block (may be wrapped in div > div > div.image)
    let image = null;
    let j = i;
    // Defensive: skip empty div.aem-Grid wrappers
    while (j < children.length && children[j].tagName === 'DIV') {
      const imgCandidate = children[j].querySelector('.cmp-image');
      if (imgCandidate) {
        image = imgCandidate;
        break;
      }
      j++;
    }
    if (image) {
      i = j + 1;
    }
    // Next, look for the description paragraph
    let desc = null;
    if (i < children.length && children[i].tagName === 'P') {
      desc = children[i];
      i++;
    }
    // Compose the card row if we have at least image and description
    if (image && desc) {
      // Text cell: title (h2) + desc (p)
      // Ensure we include ALL text content from h2 and p
      const textCell = document.createElement('div');
      textCell.appendChild(h2.cloneNode(true));
      textCell.appendChild(desc.cloneNode(true));
      cards.push([image, textCell]);
    }
  }

  if (!cards.length) return;

  // Build the table
  const headerRow = ['Cards (cards33)'];
  const tableRows = [headerRow, ...cards];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original content fragment with the table
  cf.replaceWith(table);
}
