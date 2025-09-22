/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract teaser content from a carousel item
  function extractSlideContent(carouselItem) {
    // Find the teaser block inside the carousel item
    const teaser = carouselItem.querySelector('.cmp-teaser');
    if (!teaser) return [null, null];
    // Image: find the image element inside teaser
    let image = null;
    const imageContainer = teaser.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      // Find the actual <img> element
      image = imageContainer.querySelector('img');
    }
    // Text cell: title, description, CTA
    const textContent = document.createElement('div');
    // Title
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      // Use an h2 for heading, but clone to avoid moving from DOM
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      textContent.appendChild(h2);
    }
    // Description
    const description = teaser.querySelector('.cmp-teaser__description');
    if (description) {
      // If description contains a <p>, preserve it
      if (description.children.length > 0) {
        Array.from(description.childNodes).forEach((node) => {
          textContent.appendChild(node.cloneNode(true));
        });
      } else {
        // Otherwise, just plain text
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        textContent.appendChild(p);
      }
    }
    // CTA
    const ctaContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) {
        // Place CTA at the bottom
        const cta = document.createElement('p');
        const link = document.createElement('a');
        link.href = ctaLink.href;
        link.textContent = ctaLink.textContent.trim();
        cta.appendChild(link);
        textContent.appendChild(cta);
      }
    }
    // Defensive: if textContent is empty, set to null
    const hasText = textContent.childNodes.length > 0;
    return [image, hasText ? textContent : null];
  }

  // Find the carousel content block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel items (slides)
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Build table rows
  const headerRow = ['Carousel (carousel21)'];
  const rows = [headerRow];
  items.forEach((item) => {
    const [image, text] = extractSlideContent(item);
    // Only add row if image exists
    if (image) {
      rows.push([image, text || '']);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with the block
  element.replaceWith(block);
}
