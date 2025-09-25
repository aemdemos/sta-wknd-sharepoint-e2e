/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (contains the surf spot cards)
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the elements container inside contentfragment
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We'll build an array of card rows: [image, text]
  const cardRows = [];

  // The header row
  const headerRow = ['Cards (cards33)'];

  // Get all children
  const children = Array.from(elementsContainer.children);

  // Helper to extract the first image from a container DIV
  function getImageFromDiv(div) {
    if (!div) return null;
    const img = div.querySelector('img');
    return img ? img.cloneNode(true) : null;
  }

  // Helper to extract all text content from a block (including nested elements)
  function getTextContent(elements) {
    const fragment = document.createDocumentFragment();
    elements.forEach((el) => {
      fragment.appendChild(el.cloneNode(true));
    });
    return fragment.childNodes.length === 1 ? fragment.firstChild : fragment;
  }

  // Find all cards: pattern is image (in DIV), then H2 (optional), then P (description)
  let i = 0;
  while (i < children.length) {
    // Look for a DIV with an image
    if (children[i].tagName === 'DIV' && children[i].querySelector('img')) {
      const image = getImageFromDiv(children[i]);
      let textEls = [];
      let j = i + 1;
      // Gather all text elements (H2, P) until next image DIV or end
      while (
        j < children.length &&
        !(children[j].tagName === 'DIV' && children[j].querySelector('img'))
      ) {
        if (children[j].tagName === 'H2' || children[j].tagName === 'P') {
          textEls.push(children[j]);
        }
        j++;
      }
      // Only add cards with both image and some text
      if (image && textEls.length > 0) {
        cardRows.push([
          image,
          getTextContent(textEls)
        ]);
      }
      i = j;
    } else {
      i++;
    }
  }

  // If no cards found, try fallback: intro image and first paragraph
  if (cardRows.length === 0) {
    let introImage = null;
    let introText = null;
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName === 'DIV' && children[i].querySelector('img')) {
        introImage = getImageFromDiv(children[i]);
        // Look backwards for first P before this image
        for (let j = i - 1; j >= 0; j--) {
          if (children[j].tagName === 'P') {
            introText = children[j].cloneNode(true);
            break;
          }
        }
        break;
      }
    }
    if (introImage && introText) {
      cardRows.push([
        introImage,
        introText
      ]);
    }
  }

  // Compose the table cells
  const cells = [headerRow, ...cardRows];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original contentfragment with the block
  contentFragment.replaceWith(block);
}
