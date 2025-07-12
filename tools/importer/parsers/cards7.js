/* global WebImporter */
export default function parse(element, { document }) {
  // The block expects: header row ['Cards (cards7)'], then one row per card: [image, text cell]
  // Each card: image (mandatory) and text: title (bold or heading) + description

  // Find the main contentfragment that contains the cards
  const cf = element.querySelector('article.contentfragment article.cmp-contentfragment');
  let cardRows = [];

  if (cf) {
    const cfElements = cf.querySelector('.cmp-contentfragment__elements');
    if (cfElements) {
      // We'll parse by looking for each surf break section: H2 (title), image, P (desc)
      // Titles are in H2, image is in the .cmp-image inside a sibling div, description is a P after image
      const nodes = Array.from(cfElements.childNodes).filter(n => n.nodeType === 1); // element nodes only
      let i = 0;
      while (i < nodes.length) {
        const node = nodes[i];
        if (/^H2$/i.test(node.tagName)) {
          // Start new card
          const titleEl = node;
          let imgEl = null;
          let descEl = null;

          // Seek image (may be in a .cmp-image inside a div after the H2)
          let j = i + 1;
          while (j < nodes.length) {
            const n = nodes[j];
            if (n.tagName === 'DIV' && n.querySelector('.cmp-image')) {
              imgEl = n.querySelector('.cmp-image');
              j++;
              // Optional: next node could be an empty grid div, skip
              if (j < nodes.length && nodes[j].tagName === 'DIV' && nodes[j].children.length === 0) j++;
              break;
            }
            // If it's an empty grid div, skip
            if (n.tagName === 'DIV' && n.children.length === 0) {
              j++;
              continue;
            }
            break;
          }

          // Next non-div node after image should be the description paragraph
          while (j < nodes.length) {
            const n = nodes[j];
            if (n.tagName === 'P') {
              descEl = n;
              j++;
              break;
            }
            // Defensive: skip empty grid divs
            if (n.tagName === 'DIV' && n.children.length === 0) {
              j++;
              continue;
            }
            break;
          }

          // Compose the text cell: bold/heading title, then description
          const textCell = [];
          // Heading - match the example, which used <strong>
          const strong = document.createElement('strong');
          strong.textContent = titleEl.textContent;
          textCell.push(strong);
          if (descEl) {
            textCell.push(document.createElement('br'));
            textCell.push(descEl);
          }

          // Compose the row
          cardRows.push([
            imgEl,
            textCell
          ]);

          i = j;
          continue;
        }
        i++;
      }
    }
  }

  // Build rows array
  const rows = [['Cards (cards7)']];
  if (cardRows.length) {
    rows.push(...cardRows);
  }

  // If no cards found, do not create a table (should not happen with given HTML)
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
