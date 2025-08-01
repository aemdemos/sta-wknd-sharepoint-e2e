/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // 2. Find all slides in the carousel
  const slides = carousel.querySelectorAll('.cmp-carousel__item');

  // 3. Prepare table header that exactly matches the example
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // 4. Iterate through each slide and extract image and content
  slides.forEach((slide) => {
    // Each slide should have a .cmp-teaser
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return; // skip if no teaser

    // a. IMAGE (mandatory)
    let imageCell = '';
    const teaserImageDiv = teaser.querySelector('.cmp-teaser__image .cmp-image');
    if (teaserImageDiv) {
      const img = teaserImageDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
    if (!imageCell) return; // skip slide if there is no image

    // b. TEXT CONTENT (optional: title, description, CTA)
    const contentArr = [];
    // Title
    const teaserTitle = teaser.querySelector('.cmp-teaser__title');
    if (teaserTitle && teaserTitle.textContent.trim()) {
      // Use heading level as found, reference the h2 directly
      contentArr.push(teaserTitle);
    }
    // Description (can be a plain div or a div with <p>)
    const teaserDesc = teaser.querySelector('.cmp-teaser__description');
    if (teaserDesc && teaserDesc.textContent.trim()) {
      // If it contains child elements, reference them, else wrap text in a <p>
      if (teaserDesc.children.length === 0) {
        const p = document.createElement('p');
        p.innerHTML = teaserDesc.innerHTML;
        contentArr.push(p);
      } else {
        Array.from(teaserDesc.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            contentArr.push(node);
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            contentArr.push(p);
          }
        });
      }
    }
    // Call-to-action (optional)
    const teaserCTA = teaser.querySelector('.cmp-teaser__action-link');
    if (teaserCTA) {
      contentArr.push(teaserCTA);
    }
    // Only reference contentArr if there is any content
    const contentCell = contentArr.length > 0 ? contentArr : '';
    
    // Add slide row to table
    rows.push([imageCell, contentCell]);
  });

  // 5. Create table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
