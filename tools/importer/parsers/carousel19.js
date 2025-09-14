/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse the main contentfragment block
  const cf = element.querySelector('.contentfragment');
  if (!cf) return;

  // Helper to find all images and their associated content for each slide
  function getSlides(cf) {
    const slides = [];
    // Find all image blocks inside the contentfragment
    const images = cf.querySelectorAll('[data-cmp-is="image"]');
    images.forEach((imgBlock) => {
      // The image element
      const img = imgBlock.querySelector('img');
      if (!img) return;
      // Find the parent grid column
      let gridCol = imgBlock.closest('.aem-GridColumn');
      if (!gridCol) gridCol = imgBlock.parentElement;

      // Find the heading before the image (h2)
      let slideTitle = null;
      let walker = gridCol.previousElementSibling;
      while (walker) {
        const h2 = walker.querySelector && walker.querySelector('h2');
        if (h2) {
          slideTitle = h2;
          break;
        }
        walker = walker.previousElementSibling;
      }

      // Find all paragraphs between the heading and the image
      let desc = [];
      if (slideTitle) {
        let node = slideTitle.parentElement.nextElementSibling;
        while (node && node !== gridCol) {
          if (node.tagName === 'P') {
            desc.push(node);
          }
          node = node.nextElementSibling;
        }
      }

      // Find the address paragraph after the image
      let address = null;
      let afterImg = gridCol.nextElementSibling;
      if (afterImg && afterImg.tagName === 'P') {
        address = afterImg;
      }

      // Compose the text cell
      const textCell = [];
      if (slideTitle) textCell.push(slideTitle.cloneNode(true));
      desc.forEach((d) => textCell.push(d.cloneNode(true)));
      if (address) textCell.push(address.cloneNode(true));

      // Defensive: If no heading, try to find the paragraph before the image
      if (!slideTitle && desc.length === 0) {
        let beforeImg = gridCol.previousElementSibling;
        if (beforeImg && beforeImg.tagName === 'P') {
          textCell.push(beforeImg.cloneNode(true));
        }
      }

      // If still no text, try to find the next paragraph after the image
      if (!textCell.length) {
        let next = gridCol.nextElementSibling;
        if (next && next.tagName === 'P') {
          textCell.push(next.cloneNode(true));
        }
      }

      // Only push a second cell if there is actual text content
      if (textCell.length) {
        slides.push([img.cloneNode(true), textCell]);
      } else {
        slides.push([img.cloneNode(true)]);
      }
    });
    return slides;
  }

  // Build the table
  const headerRow = ['Carousel (carousel19)'];
  const slides = getSlides(cf);
  if (!slides.length) return;
  // Remove empty second cell if there is no text content
  const cells = [headerRow, ...slides.map(row => row.length === 2 ? row : [row[0]])];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
