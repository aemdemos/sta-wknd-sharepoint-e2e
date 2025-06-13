/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article containing the surf spots cards
  const contentFragment = element.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // The actual card data is inside the .cmp-contentfragment__elements > div
  const elementsDiv = contentFragment.querySelector('.cmp-contentfragment__elements > div');
  if (!elementsDiv) return;

  // Collect all cards: each is a sequence of [H2, image, P] or [image, H2, P], etc
  const children = Array.from(elementsDiv.childNodes).filter(n => {
    // filter out empty div.aem-Grid and text nodes
    if (n.nodeType === 3) return false; // text node
    if (n.tagName === 'DIV' && n.querySelector('div.image')) return true;
    if (n.tagName === 'H2' || n.tagName === 'P') return true;
    return false;
  });

  const cards = [];

  let i = 0;
  while (i < children.length) {
    let imgDiv = null, h2 = null, descP = null;

    // Acceptable orders: h2->img->p, img->h2->p, h2->p, img->p, h2->img->div->p, etc
    if (children[i] && children[i].tagName === 'H2') {
      h2 = children[i];
      i++;
    }
    if (children[i] && children[i].tagName === 'DIV' && children[i].querySelector('div.image')) {
      imgDiv = children[i].querySelector('div.image');
      i++;
    }
    if (children[i] && children[i].tagName === 'P') {
      descP = children[i];
      i++;
    }
    // Some cards (e.g. the first) may have just imgDiv + p
    if (!h2 && children[i] && children[i].tagName === 'H2') {
      h2 = children[i];
      i++;
    }
    if (!descP && children[i] && children[i].tagName === 'P') {
      descP = children[i];
      i++;
    }
    // Compose text cell: <strong> for h2, then description
    if ((imgDiv || h2) && descP) {
      let textCell = [];
      if (h2) {
        // Use <strong> for the card title, as in the example
        const strong = document.createElement('strong');
        strong.textContent = h2.textContent;
        textCell.push(strong);
        textCell.push(document.createElement('br'));
      }
      if (descP) textCell.push(descP);
      // Always provide both columns, per spec: image/icon (mandatory), text (mandatory)
      cards.push([imgDiv ? imgDiv : '', textCell]);
    }
  }

  if (!cards.length) return;

  // Compose table array
  const headerRow = ['Cards (cards33)'];
  const tableArr = [headerRow, ...cards];
  const table = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(table);
}
