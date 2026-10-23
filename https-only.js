'use strict';
// Keep the public site on HTTPS; local development and downloaded previews are unaffected.
if (window.location.protocol === 'http:' &&
    ['archetypecoachinggroup.com', 'www.archetypecoachinggroup.com'].includes(window.location.hostname)) {
  const secureUrl = new URL(window.location.href);
  secureUrl.protocol = 'https:';
  window.location.replace(secureUrl.href);
}
