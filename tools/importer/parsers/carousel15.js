/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per example
  const headerRow = ['Carousel (carousel15)'];
  const tableRows = [headerRow];

  // Find the .cmp-carousel element inside the block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides (each .cmp-carousel__item)
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  for (const slide of slides) {
    let imageCell = null;
    let textCell = null;

    // Find image: prefer the .cmp-image element
    const imgWrap = slide.querySelector('.cmp-image');
    if (imgWrap) {
      imageCell = imgWrap;
    } else {
      // fallback: find an <img> in the slide
      const img = slide.querySelector('img');
      if (img) imageCell = img;
    }
    if (!imageCell) continue; // skip slides with no image

    // For text content: look for possible headings or paragraphs NOT inside the image block
    // In both sample HTMLs, there is no additional text content, but we need to allow for it
    // The .image/.cmp-image is always wrapped in a .image container. We'll collect siblings which are not image containers.
    let slideChildren = Array.from(slide.children);
    let possibleTextBlocks = slideChildren.filter(child =>
      !child.classList.contains('image') && !child.classList.contains('cmp-image')
    );
    // If we found any text blocks, add them as the text cell
    if (possibleTextBlocks.length === 1) {
      textCell = possibleTextBlocks[0];
    } else if (possibleTextBlocks.length > 1) {
      textCell = possibleTextBlocks;
    }

    // Compose table row
    if (textCell) {
      tableRows.push([imageCell, textCell]);
    } else {
      tableRows.push([imageCell]);
    }
  }

  // Create and replace with table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
