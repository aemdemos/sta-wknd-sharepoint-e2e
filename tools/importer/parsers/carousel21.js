/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first <img> in the teaser image block
  function getImage(teaserEl) {
    const teaserImageWrapper = teaserEl.querySelector('.cmp-teaser__image');
    if (!teaserImageWrapper) return '';
    // Find <img> inside this block
    const img = teaserImageWrapper.querySelector('img');
    return img || '';
  }

  // Helper to extract the text content, title, description, CTA link
  function getTextContent(teaserEl) {
    const fragment = document.createDocumentFragment();
    // Title
    const title = teaserEl.querySelector('.cmp-teaser__title');
    if (title) {
      // Use the original heading (h2) node directly
      fragment.appendChild(title);
    }
    // Description (could be a div or with a <p> inside)
    const desc = teaserEl.querySelector('.cmp-teaser__description');
    if (desc) {
      // If it only wraps a single <p>, use that <p> directly, else the div
      if (desc.children.length === 1 && desc.children[0].tagName === 'P') {
        fragment.appendChild(desc.children[0]);
      } else {
        // If there's text directly, use the whole node
        Array.from(desc.childNodes).forEach((node) => {
          fragment.appendChild(node);
        });
      }
    }
    // CTA (may not exist)
    const cta = teaserEl.querySelector('.cmp-teaser__action-link');
    if (cta) {
      fragment.appendChild(cta);
    }
    // Return nodes as array (required by createTable if multiple top-level nodes)
    if (fragment.childNodes.length) {
      return Array.from(fragment.childNodes);
    }
    return '';
  }

  // Find the main carousel node (with cmp-carousel class)
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('.cmp-carousel__item'));

  const tableRows = [];
  // Header row matches example exactly
  tableRows.push(['Carousel (carousel21)']);

  slides.forEach((slide) => {
    // Each slide contains a .cmp-teaser
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;
    const img = getImage(teaser);
    const textContent = getTextContent(teaser);
    tableRows.push([img, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
