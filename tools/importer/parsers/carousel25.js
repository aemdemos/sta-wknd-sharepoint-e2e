/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all carousel slides from the main content
  function getCarouselSlides(main) {
    const slides = [];
    // Find the main article contentfragment
    const contentFragment = main.querySelector('.contentfragment .cmp-contentfragment');
    if (!contentFragment) return slides;
    // Find all h2 titles (slide sections)
    const h2s = contentFragment.querySelectorAll('h2.cmp-title__text');
    h2s.forEach(h2 => {
      // Find image in the same section (search up to parent and siblings)
      let section = h2.closest('.aem-GridColumn');
      if (!section) section = h2.parentElement;
      let img = null;
      // Try to find image in the same section or next sibling
      img = section.querySelector('.cmp-image__image');
      if (!img) {
        let sib = section.nextElementSibling;
        while (sib && !img) {
          img = sib.querySelector ? sib.querySelector('.cmp-image__image') : null;
          sib = sib.nextElementSibling;
        }
      }
      if (!img) return;
      // Find all content between this h2 and the next h2 (including paragraphs and other elements)
      const cell2 = [];
      // Add the h2 as the title
      cell2.push(h2.cloneNode(true));
      // Find all following siblings until the next h2
      let walker = section.nextElementSibling;
      while (walker && !walker.querySelector('h2.cmp-title__text')) {
        // Add all paragraphs and blockquotes in this sibling
        walker.querySelectorAll('p, blockquote').forEach(node => cell2.push(node.cloneNode(true)));
        walker = walker.nextElementSibling;
      }
      slides.push([img.cloneNode(true), cell2]);
    });
    return slides;
  }

  // Defensive: find the main content area
  let main = element;
  if (!main.classList.contains('container')) {
    main = element.querySelector('.container');
  }
  if (!main) return;

  // Get carousel slides
  const slides = getCarouselSlides(main);
  if (!slides.length) return;

  // Build table rows
  const headerRow = ['Carousel (carousel25)'];
  const rows = [headerRow, ...slides];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
