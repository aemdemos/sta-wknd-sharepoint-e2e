/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image (should be the first .image block with an <img>)
  function findHeroImage(el) {
    const img = el.querySelector('.image .cmp-image__image');
    return img || null;
  }

  // Find only the main heading, subheading, and first CTA link in the hero area
  function findHeroText(el) {
    const content = [];
    // Get the main heading
    const h1 = el.querySelector('h1');
    if (h1) content.push(h1);
    // Get the subheading (h4)
    const h4 = el.querySelector('h4');
    if (h4) content.push(h4);
    // Find the first CTA link (if any) in the hero area
    let cta = null;
    if (h1) {
      cta = h1.querySelector('a');
    }
    if (!cta && h4) {
      cta = h4.querySelector('a');
    }
    if (!cta) {
      // Search for the first link after h1/h4
      const links = el.querySelectorAll('a');
      if (links.length > 0) cta = links[0];
    }
    if (cta) content.push(cta);
    return content;
  }

  const headerRow = ['Hero (hero18)'];
  const heroImg = findHeroImage(element);
  const imageRow = [heroImg ? heroImg : ''];
  const heroText = findHeroText(element);
  const textRow = [heroText.length ? heroText : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    textRow,
  ], document);

  element.replaceWith(table);
}
