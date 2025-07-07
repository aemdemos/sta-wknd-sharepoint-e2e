/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article containing skatepark cards
  const article = element.querySelector('article.contentfragment');
  if (!article) return;

  // Find all h2 skatepark titles in order
  const h2s = article.querySelectorAll('h2.cmp-title__text');
  const cards = [];

  h2s.forEach((h2) => {
    // Locate the card's top-level container for sibling traversal
    const cardBlock = h2.closest('.cmp-title').parentElement;

    // 1. Find the image for this card: search forward, then backward if not found
    let image = null;
    let searchNode = cardBlock.nextElementSibling;
    let tries = 0;
    while (searchNode && tries < 5) {
      image = searchNode.querySelector && searchNode.querySelector('img');
      if (image) break;
      searchNode = searchNode.nextElementSibling;
      tries++;
    }
    if (!image) {
      searchNode = cardBlock.previousElementSibling;
      tries = 0;
      while (searchNode && tries < 3) {
        image = searchNode.querySelector && searchNode.querySelector('img');
        if (image) break;
        searchNode = searchNode.previousElementSibling;
        tries++;
      }
    }

    // 2. Find the main descriptive paragraph: look forward for a <p> (after h2)
    let desc = null;
    searchNode = cardBlock.nextElementSibling;
    tries = 0;
    while (searchNode && tries < 5 && !desc) {
      if (searchNode.querySelector) {
        const p = searchNode.querySelector('p');
        if (p && p.textContent.trim()) desc = p;
      }
      searchNode = searchNode.nextElementSibling;
      tries++;
    }

    // 3. Optionally find address/information paragraph: look for <p> with <b> and <i> after desc
    let address = null;
    if (desc) {
      searchNode = desc.parentElement.nextElementSibling;
      tries = 0;
      while (searchNode && tries < 3 && !address) {
        if (searchNode.querySelector) {
          const ib = searchNode.querySelector('i > b');
          if (ib) address = searchNode;
        }
        searchNode = searchNode.nextElementSibling;
        tries++;
      }
    }

    // Compose card content cell: title (h2), description, address (if any)
    const contentCell = [h2];
    if (desc) contentCell.push(desc);
    if (address) contentCell.push(address);

    cards.push([
      image ? image : '',
      contentCell.length === 1 ? contentCell[0] : contentCell
    ]);
  });

  // Only create block if cards found
  if (cards.length) {
    const cells = [['Cards (cards20)'], ...cards];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
