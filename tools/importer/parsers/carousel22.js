/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const contentRoot = carousel.querySelector('.cmp-carousel__content');
  if (!contentRoot) return;
  const items = Array.from(contentRoot.children).filter(
    (el) => el.classList.contains('cmp-carousel__item')
  );

  // Create header row matching the example exactly
  const cells = [['Carousel (carousel22)']];

  items.forEach((item) => {
    // Find the image (always in teaser > .cmp-teaser__image .cmp-image img)
    const img = item.querySelector('.cmp-image img');

    // Find the text container
    const textEls = [];
    // Title
    const title = item.querySelector('.cmp-teaser__title');
    if (title) textEls.push(title);
    // Description: could be a <div> containing text or a <div> with a <p>
    const desc = item.querySelector('.cmp-teaser__description');
    if (desc) {
      if (
        desc.children.length === 1 &&
        desc.firstElementChild.tagName.toLowerCase() === 'p'
      ) {
        textEls.push(desc.firstElementChild);
      } else {
        // If there's just text, wrap it in a <p>
        const p = document.createElement('p');
        p.innerHTML = desc.innerHTML;
        textEls.push(p);
      }
    }
    // CTA Link
    const cta = item.querySelector('.cmp-teaser__action-link');
    if (cta) textEls.push(cta);

    cells.push([
      img ? img : '',
      textEls.length ? textEls : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
