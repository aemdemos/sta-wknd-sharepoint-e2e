/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a slide
  function getImage(teaser) {
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    if (!imgContainer) return null;
    const img = imgContainer.querySelector('img');
    return img || null;
  }

  // Helper to extract the text content (title, description, CTA) from a slide
  function getTextContent(teaser) {
    const frag = document.createDocumentFragment();
    // Title
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      // Use the heading as is, preserving semantic level
      frag.appendChild(title);
    }
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      // If the description contains only a <p>, use its content, else use as is
      if (desc.childElementCount === 1 && desc.firstElementChild.tagName === 'P') {
        frag.appendChild(desc.firstElementChild);
      } else {
        frag.appendChild(desc);
      }
    }
    // CTA (button/link)
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      frag.appendChild(cta);
    }
    // If nothing was added, return empty string
    if (!frag.childNodes.length) return '';
    // Otherwise, wrap in a div for table cell
    const wrapper = document.createElement('div');
    wrapper.appendChild(frag);
    return wrapper;
  }

  // Find the carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Compose table rows
  const rows = [];
  // Header row
  rows.push(['Carousel (carousel22)']);

  slides.forEach((slide) => {
    // Each slide contains a .cmp-teaser
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;
    const img = getImage(teaser);
    if (!img) return; // Image is mandatory
    const textContent = getTextContent(teaser);
    rows.push([
      img,
      textContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
