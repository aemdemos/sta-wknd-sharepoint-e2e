/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cfArticle = element.querySelector('article.contentfragment, .cmp-contentfragment, [data-cmp-contentfragment-model]');
  if (!cfArticle) return;
  // Find the content block that holds the H2s, Ps, and image divs
  const cfContent = cfArticle.querySelector('.cmp-contentfragment__elements > div');
  if (!cfContent) return;

  // Extract all children: we're interested in H2, P, and image-containing divs (which may be nested)
  const nodes = Array.from(cfContent.children);
  // The cards start at the first H2 (skip intro text)
  let cardStartIdx = nodes.findIndex(n => n.tagName === 'H2');
  if (cardStartIdx === -1) return;

  // Compose cards
  const cards = [];
  let i = cardStartIdx;
  while (i < nodes.length) {
    let h2 = null;
    let img = null;
    let ps = [];
    // Find next H2 (card title)
    if (nodes[i].tagName === 'H2') {
      h2 = nodes[i];
      i++;
      // Next, check for a div with .aem-Grid and inside it an .cmp-image (image)
      if (
        i < nodes.length &&
        nodes[i].tagName === 'DIV' &&
        nodes[i].querySelector('.cmp-image')
      ) {
        img = nodes[i].querySelector('.cmp-image');
        i++;
      }
      // Then, collect description Ps (may be more than one, but in this HTML, exactly one per card)
      while (i < nodes.length && nodes[i].tagName === 'P') {
        ps.push(nodes[i]);
        i++;
      }
      // There may be a "div.aem-Grid" with no .cmp-image as a row separator, skip it
      while (
        i < nodes.length &&
        nodes[i].tagName === 'DIV' &&
        nodes[i].classList.contains('aem-Grid') &&
        !nodes[i].querySelector('.cmp-image')
      ) {
        i++;
      }
      // Now, we have a card: image (required), h2, and ps[]
      if (img && h2 && ps.length > 0) {
        cards.push({ image: img, title: h2, descNodes: ps });
      }
    } else {
      i++;
    }
  }

  // Compose the table rows
  const tableRows = [['Cards (cards16)']];
  cards.forEach(card => {
    // Text cell: title (h2) + all ps
    const textCell = [card.title, ...card.descNodes];
    tableRows.push([
      card.image,
      textCell
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
