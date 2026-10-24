'use strict';
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
document.querySelectorAll('[data-interest]').forEach(link => {
  link.addEventListener('click', () => {
    const interest = document.querySelector('#interest');
    interest.value = link.dataset.interest;
    document.querySelector('#form-status').textContent = `Selected: ${interest.value}. Tell us a little about what you have in mind.`;
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();

const trainingContent = {
  leadership: { title: 'Great leadership starts with everyday moments.', description: 'From first-time managers to established leaders, build the confidence to communicate clearly, coach others, manage performance and lead change.', outcomes: ['Confident conversations & feedback', 'Coaching, delegation & team development', 'Managing performance & leading change'], connection: 'Connect the learning: use AI to prepare a coaching conversation, and explore a tailored system to support team development.', cta: 'Shape your leadership programme', graphic: '◎' },
  projects: { title: 'Bring structure to the big idea.', description: 'Give your people practical tools to plan, deliver and review projects. Build a shared approach to priorities, stakeholders, risks and the next clear step.', outcomes: ['Project planning, scope & priorities', 'Stakeholder communication & risk awareness', 'Delivery, review & lessons learned'], connection: 'Connect the learning: explore AI-assisted planning, then scope a project dashboard that makes progress easier to see.', cta: 'Shape your project programme', graphic: '▦' },
  service: { title: 'Make every conversation count.', description: 'Support your team to understand customer needs, communicate with confidence and handle difficult situations. Use examples drawn from your own service environment.', outcomes: ['Listening, empathy & clear communication', 'Handling complaints & challenging conversations', 'Consistent service & continuous improvement'], connection: 'Connect the learning: practise reviewing AI-drafted responses, and explore a client portal that makes service feel more joined up.', cta: 'Shape your service programme', graphic: '◌' },
  operations: { title: 'Better processes. Stronger everyday performance.', description: 'Help your people see how work flows, where friction builds and what could improve. Turn day-to-day operational challenges into practical learning opportunities.', outcomes: ['Process mapping & practical problem-solving', 'Planning, quality & resource awareness', 'Performance review & continuous improvement'], connection: 'Connect the learning: explore AI for routine planning, and scope a bespoke workflow that supports the way your team actually works.', cta: 'Shape your operations programme', graphic: '⌘' }
};
function selectTraining(tab) {
  const content = trainingContent[tab.dataset.topic];
  document.querySelectorAll('.training-tab').forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  document.querySelector('#training-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('#training-title').textContent = content.title;
  document.querySelector('#training-description').textContent = content.description;
  const outcomes = document.querySelector('#training-outcomes');
  outcomes.replaceChildren(...content.outcomes.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  document.querySelector('#training-connection').textContent = content.connection;
  document.querySelector('.topic-graphic').textContent = content.graphic;
  document.querySelector('#training-enquire').firstChild.textContent = content.cta + ' ';
}
const trainingTabs = [...document.querySelectorAll('.training-tab')];
trainingTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTraining(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % trainingTabs.length;
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + trainingTabs.length) % trainingTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = trainingTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTraining(trainingTabs[next]); trainingTabs[next].focus(); }
  });
});
const dashboardTabs = [...document.querySelectorAll('.dashboard-switch [role="tab"]')];
function selectDashboard(tab) {
  dashboardTabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  const assessor = tab.id === 'assessor-tab';
  document.querySelector('#workspace-role').textContent = assessor ? 'Assessor workspace' : 'Master workspace';
  document.querySelector('#rail-selected span').textContent = assessor ? 'Assessor dashboard' : 'Master dashboard';
}
dashboardTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectDashboard(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (['ArrowRight','ArrowLeft'].includes(event.key)) next = 1 - index;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 1;
    if (next !== undefined) { event.preventDefault(); selectDashboard(dashboardTabs[next]); dashboardTabs[next].focus(); }
  });
});

const productLightbox = document.querySelector('#product-lightbox');
let imageTrigger;
document.querySelectorAll('[data-product-image]').forEach(button => {
  button.addEventListener('click', () => {
    imageTrigger = button;
    const image = document.querySelector('#lightbox-image');
    image.src = button.querySelector('img').currentSrc || button.querySelector('img').src;
    image.alt = button.querySelector('img').alt;
    document.querySelector('#lightbox-caption').textContent = button.dataset.productCaption;
    productLightbox.showModal();
    document.body.classList.add('image-expanded');
  });
});
document.querySelector('.lightbox-close').addEventListener('click', () => productLightbox.close());
productLightbox.addEventListener('click', event => { if (event.target === productLightbox) productLightbox.close(); });
productLightbox.addEventListener('close', () => {
  document.body.classList.remove('image-expanded');
  imageTrigger?.focus();
});

// Progressive enhancement: show a branded page only after Formspree confirms success.
const enquiryForm = document.querySelector('#enquiryForm');
const enquiryStatus = document.querySelector('#form-status');
const enquirySubmit = enquiryForm.querySelector('[type="submit"]');
const emailAlternative = document.querySelector('#email-enquiry');
const secureFormFallback = document.querySelector('#secure-form-fallback');
const enquiryButtonContent = enquirySubmit.innerHTML;
let enquiryPending = false;
function enquiryEmailBody() {
  const data = new FormData(enquiryForm);
  return `Website enquiry\n\nName: ${data.get('name') || ''}\nOrganisation: ${data.get('Organisation') || ''}\nEmail: ${data.get('email') || ''}\nInterest: ${data.get('Interest') || ''}\n\n${data.get('message') || ''}`;
}
function refreshEmailAlternative() {
  emailAlternative.href = `mailto:enquiry@archetypecoachinggroup.com?subject=${encodeURIComponent('Website enquiry — Archetype')}&body=${encodeURIComponent(enquiryEmailBody())}`;
}
function resetEnquiryButton() {
  enquiryPending = false;
  enquirySubmit.disabled = false;
  enquirySubmit.innerHTML = enquiryButtonContent;
  enquiryForm.removeAttribute('aria-busy');
}
enquiryForm.addEventListener('input', refreshEmailAlternative);
enquiryForm.addEventListener('change', refreshEmailAlternative);
emailAlternative.addEventListener('click', refreshEmailAlternative);
enquiryForm.addEventListener('submit', async event => {
  if (enquiryPending || !enquiryForm.reportValidity() || String(enquiryForm.elements._gotcha?.value || '').trim()) {
    event.preventDefault();
    return;
  }
  enquiryForm.action = 'https://formspree.io/f/mbgglrpw';
  const nativeSubmission = event.submitter?.id === 'submit-direct' || !window.fetch || !window.AbortController;
  if (!nativeSubmission) event.preventDefault();
  enquiryPending = true;
  enquirySubmit.disabled = true;
  enquirySubmit.textContent = nativeSubmission ? 'Opening secure submission…' : 'Sending your enquiry…';
  enquiryStatus.textContent = nativeSubmission ? 'Please wait for the secure confirmation page.' : 'Sending securely. Please keep this page open.';
  enquiryStatus.dataset.state = 'pending';
  enquiryForm.setAttribute('aria-busy', 'true');
  if (nativeSubmission) return;
  secureFormFallback.hidden = true;
  refreshEmailAlternative();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(enquiryForm.action, {
      method: 'POST', body: new FormData(enquiryForm),
      headers: { Accept: 'application/json' },
      credentials: 'omit', redirect: 'error', signal: controller.signal
    });
    const result = await response.json();
    const accepted = response.ok && result && result.ok !== false && !result.error &&
      (!result.errors || (Array.isArray(result.errors) && result.errors.length === 0)) &&
      (typeof result.next === 'string' || result.ok === true);
    if (!accepted) {
      const failure = new Error('Enquiry not accepted');
      failure.fieldErrors = Array.isArray(result?.errors) ? result.errors : [];
      throw failure;
    }
    enquiryStatus.dataset.state = 'success';
    enquiryStatus.textContent = 'Your enquiry has been accepted. Opening your confirmation…';
    // Keep personal information out of the address and the confirmation page.
    window.location.assign('thank-you.html');
  } catch (error) {
    const invalidEmail = error.fieldErrors?.some(item => item.field === 'email');
    enquiryStatus.dataset.state = 'error';
    enquiryStatus.textContent = invalidEmail
      ? 'Please check your email address and try again. Your enquiry details are still here.'
      : 'We couldn’t confirm the background submission. Your details are still here. You can continue via the secure form below, or email your enquiry instead.';
    secureFormFallback.hidden = Boolean(invalidEmail);
    resetEnquiryButton();
    refreshEmailAlternative();
  } finally {
    window.clearTimeout(timeout);
  }
});
window.addEventListener('pageshow', () => {
  resetEnquiryButton();
  enquiryStatus.textContent = '';
  delete enquiryStatus.dataset.state;
  secureFormFallback.hidden = true;
  refreshEmailAlternative();
});
refreshEmailAlternative();
