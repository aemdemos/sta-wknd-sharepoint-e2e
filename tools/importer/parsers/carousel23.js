/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel23) block parsing
  // Table header row
  const headerRow = ['Carousel (carousel23)'];

  // Find carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all carousel items (slides)
  const slideEls = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // Helper to extract image from a slide
  function getImage(slide) {
    // Find image element inside the teaser
    const img = slide.querySelector('.cmp-teaser__image img');
    return img || null;
  }

  // Helper to extract text content from a slide
  function getTextContent(slide) {
    // Find teaser content
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (!teaserContent) return null;
    const textParts = [];
    // Heading
    const heading = teaserContent.querySelector('.cmp-teaser__title');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      textParts.push(h2);
    }
    // Description
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) {
      // If description is a <div> with HTML, preserve children
      if (desc.children.length > 0) {
        Array.from(desc.childNodes).forEach((node) => {
          textParts.push(node.cloneNode(true));
        });
      } else {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textParts.push(p);
      }
    }
    // CTA
    const cta = teaserContent.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Place CTA at the end
      textParts.push(cta);
    }
    // Wrap all text parts in a div for cell
    if (textParts.length > 0) {
      const cellDiv = document.createElement('div');
      textParts.forEach((part) => cellDiv.append(part));
      return cellDiv;
    }
    return null;
  }

  // Build table rows for each slide
  const rows = slideEls.map((slide) => {
    const img = getImage(slide);
    const textContent = getTextContent(slide);
    // Always put image in first cell, text in second
    return [img, textContent];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element
  element.replaceWith(block);
}
