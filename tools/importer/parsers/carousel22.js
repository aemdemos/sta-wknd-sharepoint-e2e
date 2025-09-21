/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all slides from the carousel
  function getSlides(carouselContent) {
    // Select all carousel items (slides)
    return Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));
  }

  // Helper to extract image element from a slide
  function getImageEl(slide) {
    // Find the teaser image container
    const imgContainer = slide.querySelector('.cmp-teaser__image');
    if (!imgContainer) return null;
    // Find the actual <img> inside
    const img = imgContainer.querySelector('img');
    return img || null;
  }

  // Helper to extract text content (title, description, CTA) from a slide
  function getTextContentEl(slide) {
    const contentFrag = document.createDocumentFragment();
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (!teaserContent) return null;

    // Title
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) {
      // Use <h2> or <h3> as appropriate, but preserve the heading
      contentFrag.appendChild(title);
    }
    // Description
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) {
      contentFrag.appendChild(desc);
    }
    // CTA (action link)
    const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      // Only append the link(s), not the container div
      const links = Array.from(ctaContainer.querySelectorAll('a'));
      links.forEach(link => contentFrag.appendChild(link));
    }
    // If nothing was added, return null
    if (!contentFrag.childNodes.length) return null;
    return contentFrag;
  }

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Build the table rows
  const rows = [];
  // Header row as per block requirements
  rows.push(['Carousel (carousel22)']);

  // For each slide, extract image and text content
  const slides = getSlides(carouselContent);
  slides.forEach(slide => {
    const imgEl = getImageEl(slide);
    const textEl = getTextContentEl(slide);
    // Only add the image if it exists, and always in first cell
    // Second cell is text content fragment (may be null)
    rows.push([
      imgEl ? imgEl : '',
      textEl ? textEl : ''
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
