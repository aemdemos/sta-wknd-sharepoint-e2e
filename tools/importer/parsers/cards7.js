/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content fragment with surf spots sections.
  const contentFragment = element.querySelector('article.contentfragment, .contentfragment, [class*="contentfragment"]');
  if (!contentFragment) return;
  
  const mainContent = contentFragment.querySelector('.cmp-contentfragment__elements > div');
  if (!mainContent) return;
  
  // Source consists of a sequence: Intro Paragraph, then repeating: H2, (optional) image, paragraph
  const children = Array.from(mainContent.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));

  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];
  let i = 0;
  while (i < children.length) {
    // Look for section start: H2
    let cardTitle, cardImage, cardDesc;
    if (children[i].nodeType === 1 && children[i].tagName === 'H2') {
      cardTitle = children[i];
      let j = i + 1;
      // Look for image after h2, inside .cmp-image
      if (
        children[j] &&
        children[j].nodeType === 1 &&
        children[j].querySelector &&
        children[j].querySelector('.cmp-image')
      ) {
        cardImage = children[j].querySelector('.cmp-image');
        j++;
      }
      // The next element is the description paragraph
      if (children[j] && children[j].nodeType === 1 && children[j].tagName === 'P') {
        cardDesc = children[j];
        j++;
      }
      // If both image and desc are missing, skip this card
      if (!cardImage && !cardDesc) {
        i = j;
        continue;
      }

      // Build text cell: strong for title, then description (if present)
      const textArr = [];
      if (cardTitle) {
        const strong = document.createElement('strong');
        strong.textContent = cardTitle.textContent;
        textArr.push(strong);
      }
      if (cardDesc) {
        if (textArr.length > 0) textArr.push(document.createElement('br'));
        textArr.push(cardDesc);
      }
      rows.push([
        cardImage ? cardImage : '',
        textArr.length === 1 ? textArr[0] : textArr
      ]);
      i = j;
    } else {
      i++;
    }
  }

  // Only build the table if there are cards
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
