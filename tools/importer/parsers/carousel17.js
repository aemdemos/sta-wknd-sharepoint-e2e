/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Carousel (carousel17)'];

  // Find the main carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Gather all slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  const rows = [headerRow];

  slides.forEach(slide => {
    // Get the image element (mandatory)
    let img = slide.querySelector('img');
    if (!img) {
      // fallback: search inside .cmp-image
      const imageDiv = slide.querySelector('.cmp-image');
      if (imageDiv) {
        img = imageDiv.querySelector('img');
      }
    }
    if (!img) return; // If no image found, skip slide

    // Prepare to gather any meaningful text content except what's part of the image
    let contentNodes = [];
    // Collect all children that are not or do not contain the image
    Array.from(slide.children).forEach(child => {
      if (!child.contains(img) && child.textContent.trim()) {
        contentNodes.push(child);
      }
    });
    // If nothing collected, check one level deeper (handle stray wrappers)
    if (contentNodes.length === 0) {
      Array.from(slide.querySelectorAll(':scope > *')).forEach(child => {
        if (!child.contains(img) && child.textContent.trim()) {
          contentNodes.push(child);
        }
      });
    }

    // If still nothing, fallback to image metadata (title/alt/caption)
    if (contentNodes.length === 0) {
      const metaCaption = slide.querySelector('meta[itemprop="caption"]');
      const imgTitle = img.getAttribute('title');
      const imgAlt = img.getAttribute('alt');
      if (imgTitle && imgTitle.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = imgTitle;
        contentNodes.push(h2);
      }
      if (metaCaption && metaCaption.content && metaCaption.content.trim()) {
        const p = document.createElement('p');
        p.textContent = metaCaption.content;
        contentNodes.push(p);
      } else if (imgAlt && imgAlt.trim()) {
        const p = document.createElement('p');
        p.textContent = imgAlt;
        contentNodes.push(p);
      }
    }
    // If absolutely nothing (edge case), leave cell empty
    const textCell = contentNodes.length > 0 ? contentNodes : '';

    // Each row: [image, text cell (may be empty string or array of nodes)]
    rows.push([img, textCell]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
