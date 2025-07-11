/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment (contains the card data)
  const cf = element.querySelector('article.contentfragment, .cmp-contentfragment');
  if (!cf) return;
  const cfElementsDiv = cf.querySelector('.cmp-contentfragment__elements > div:last-child');
  if (!cfElementsDiv) return;

  // Helper to find the next sibling element matching a selector
  function nextElementSibling(el, selector) {
    let sib = el.nextElementSibling;
    while (sib) {
      if (sib.matches(selector)) return sib;
      sib = sib.nextElementSibling;
    }
    return null;
  }

  // Rows for the table (header plus cards)
  const cells = [
    ['Cards (cards7)']
  ];

  // The first card (intro) is before the first <h2>
  // Get first .image .cmp-image and first <p>
  const firstImageDiv = cfElementsDiv.querySelector('.image .cmp-image');
  const introParagraph = cfElementsDiv.querySelector('p');
  if (firstImageDiv && introParagraph) {
    cells.push([firstImageDiv, introParagraph]);
  }

  // Now loop through card sections (each starts with an <h2>)
  const cardTitleNodes = Array.from(cfElementsDiv.querySelectorAll('h2'));
  cardTitleNodes.forEach((h2) => {
    // Find the next .image .cmp-image after <h2> (in a direct sibling div)
    let imageDiv = null;
    let sib = h2.nextElementSibling;
    while (sib) {
      if (sib.querySelector && sib.querySelector('.image .cmp-image')) {
        imageDiv = sib.querySelector('.image .cmp-image');
        break;
      }
      // Break if we hit <p> before finding image
      if (sib.tagName === 'P') break;
      sib = sib.nextElementSibling;
    }
    // Get the description text: first <p> after <h2>
    const contentP = nextElementSibling(h2, 'p');
    if (!contentP) return; // Skip card if no text
    // Compose the text cell: strong for card title, then description
    const textFragment = document.createDocumentFragment();
    const strong = document.createElement('strong');
    strong.textContent = h2.textContent;
    textFragment.appendChild(strong);
    textFragment.appendChild(document.createElement('br'));
    textFragment.appendChild(contentP);
    // For the card row: always two columns
    cells.push([
      imageDiv || '',
      textFragment
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
