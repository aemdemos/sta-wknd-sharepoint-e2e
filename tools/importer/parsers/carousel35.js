/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the carousel content area and all slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');

  // Prepare rows: Header row (1 col, exactly as in the example)
  const rows = [['Carousel (carousel35)']];

  items.forEach(item => {
    // IMAGE CELL (first column)
    const img = item.querySelector('img');
    const imgCell = img || '';

    // TEXT CELL (second column) - Gather all possible text content
    let textElements = [];

    // 1. Check for meta caption
    const imgContainer = item.querySelector('[data-cmp-is="image"]');
    let foundHeading = false;
    if (imgContainer) {
      const metaCaption = imgContainer.querySelector('meta[itemprop="caption"]');
      if (metaCaption && metaCaption.content && metaCaption.content.trim()) {
        const heading = document.createElement('h2');
        heading.textContent = metaCaption.content.trim();
        textElements.push(heading);
        foundHeading = true;
      } else {
        // Fallback to dc:title
        const cmpData = imgContainer.getAttribute('data-cmp-data-layer');
        if (cmpData) {
          try {
            const json = JSON.parse(cmpData.replace(/&quot;/g, '"'));
            const keys = Object.keys(json);
            if (keys.length && json[keys[0]].hasOwnProperty('dc:title') && json[keys[0]]['dc:title'].trim()) {
              const heading = document.createElement('h2');
              heading.textContent = json[keys[0]]['dc:title'].trim();
              textElements.push(heading);
              foundHeading = true;
            }
          } catch (e) {}
        }
      }
    }

    // 2. Gather all content that could be a description or CTA from slide item (excluding image container)
    Array.from(item.children).forEach(child => {
      if (!child.classList.contains('image')) {
        // If the child is not the image container, include all its children and text
        Array.from(child.childNodes).forEach(node => {
          // Only add real elements or non-empty text
          if (node.nodeType === Node.ELEMENT_NODE) {
            textElements.push(node);
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length) {
            const span = document.createElement('span');
            span.textContent = node.textContent.trim();
            textElements.push(span);
          }
        });
      }
    });

    // 3. If nothing found for text cell, make it blank
    const textCell = textElements.length === 1 ? textElements[0] : (textElements.length > 1 ? textElements : '');

    rows.push([imgCell, textCell]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
