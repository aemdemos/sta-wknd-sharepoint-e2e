/* global WebImporter */
export default function parse(element, { document }) {
  // Find the contentfragment article (the main surf spots content)
  const mainContent = element.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!mainContent) return;

  // The .cmp-contentfragment__elements contains the actual article body
  const cfEls = mainContent.querySelector('.cmp-contentfragment__elements');
  if (!cfEls) return;

  // Helper to normalize HTML entities and trim whitespace
  function normalizeText(html) {
    if (!html) return '';
    // Decode HTML entities
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent.replace(/\s+/g, ' ').trim();
  }

  // Placeholder image generator
  function getPlaceholderImage() {
    const img = document.createElement('img');
    img.src = 'https://dummyimage.com/640x480/cccccc/ffffff&text=';
    img.alt = '';
    img.setAttribute('loading', 'lazy');
    return img;
  }

  // Collect all h2s (each is a card title)
  const h2s = Array.from(cfEls.querySelectorAll('h2'));
  const cards = [];
  for (let i = 0; i < h2s.length; i++) {
    const h2 = h2s[i];
    // Find the image corresponding to this card (image is usually in a div after h2)
    let img = null, caption = null;
    let sib = h2.nextElementSibling;
    // Skip empty div wrappers to get to the image
    while (sib && sib.tagName === 'DIV' && !sib.querySelector('img')) {
      sib = sib.nextElementSibling;
    }
    if (sib && sib.querySelector) {
      img = sib.querySelector('img');
      caption = sib.querySelector('span[itemprop="caption"]');
    }
    // If image is missing, use a placeholder image element
    let imgCell;
    if (!img) {
      imgCell = getPlaceholderImage();
    } else if (caption) {
      imgCell = [img, document.createElement('br'), caption];
    } else {
      imgCell = img;
    }
    // Now find the first <p> after the h2 (and after image divs)
    let textP = sib;
    while (textP && textP.tagName !== 'P') {
      textP = textP.nextElementSibling;
    }
    // Compose title (<strong>h2 text</strong>) + description
    const textCell = [];
    const strong = document.createElement('strong');
    strong.textContent = h2.textContent;
    textCell.push(strong);
    if (textP) {
      textCell.push(document.createElement('br'));
      textCell.push(document.createTextNode(normalizeText(textP.innerHTML)));
    }
    cards.push([imgCell, textCell]);
  }
  // Compose the array of cells for the block table
  const cells = [
    ['Cards (cards17)'],
    ...cards
  ];
  // Create table and replace the original block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  mainContent.replaceWith(table);
}
