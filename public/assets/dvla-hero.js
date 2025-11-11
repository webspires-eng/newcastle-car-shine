(function () {
  'use strict';

  const TEMPLATE = `
<div class="dvla-hero" data-dvla-hero>
  <div class="dvla-hero__grid">
    <div class="dvla-hero__intro">
      <p class="dvla-hero__eyebrow">DVLA-backed valuation</p>
      <h2 class="dvla-hero__headline">Sell smarter in 3 quick steps</h2>
      <p class="dvla-hero__lede">Motorway-style valuations using the official DVLA record, live dealer demand and a secure seller hand-off.</p>
      <div class="dvla-hero__trustpilot" aria-hidden="true">
        <div class="dvla-hero__trust-stars" role="img" aria-label="Trustpilot rating Excellent">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="dvla-hero__trust-copy">
          <strong>Excellent</strong>
          <span>92,250+ reviews</span>
        </div>
      </div>
      <ol class="dvla-hero__progress" data-active-step="1" aria-label="DVLA lookup steps">
        <li data-step="1">VRM check</li>
        <li data-step="2">Mileage</li>
        <li data-step="3">Email</li>
      </ol>
    </div>

    <div class="dvla-hero__panel">
      <div class="dvla-hero__flow" aria-live="off">
        <form class="dvla-hero__step" data-step="1" data-form="vrm" novalidate>
          <p class="dvla-hero__step-label">Step 1 of 3</p>
          <h3 class="dvla-hero__step-title">Check your reg</h3>
          <label class="dvla-hero__label" for="dvla-hero-vrm">Enter your reg</label>
          <div class="dvla-hero__plate-input">
            <span class="dvla-hero__plate-flag" aria-hidden="true">UK</span>
            <input
              id="dvla-hero-vrm"
              name="vrm"
              type="text"
              inputmode="text"
              maxlength="8"
              autocomplete="off"
              spellcheck="false"
              placeholder="OO07 HAD"
              aria-describedby="dvla-hero-vrm-help"
              required
            />
          </div>
          <p id="dvla-hero-vrm-help" class="dvla-hero__help">We only use this to fetch the official DVLA record.</p>
          <button type="submit" class="dvla-hero__cta" data-loading-text="Looking up…">Value your car →</button>
          <p class="dvla-hero__error" data-error="vrm" role="status" aria-live="polite"></p>
        </form>

        <form class="dvla-hero__step is-hidden" data-step="2" data-form="mileage" novalidate>
          <p class="dvla-hero__step-label">Step 2 of 3</p>
          <h3 class="dvla-hero__step-title">Confirm vehicle & mileage</h3>
          <div class="dvla-hero__vehicle" aria-live="polite">
            <div class="dvla-hero__plate-badge">
              <span class="dvla-hero__plate-flag">UK</span>
              <span class="dvla-hero__plate-value" data-plate>VRM</span>
            </div>
            <p class="dvla-hero__vehicle-line" data-vehicle-line>MAKE MODEL • YEAR • COLOUR • BODY • FUEL</p>
          </div>
          <label class="dvla-hero__label" for="dvla-hero-mileage">Current mileage</label>
          <div class="dvla-hero__mileage-input">
            <input
              id="dvla-hero-mileage"
              name="mileage"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="79,000"
              aria-describedby="dvla-hero-mileage-help"
              required
            />
            <span class="dvla-hero__tick" aria-hidden="true">✓</span>
          </div>
          <p id="dvla-hero-mileage-help" class="dvla-hero__help">Between 1 and 400,000 miles. Commas optional.</p>
          <div class="dvla-hero__actions">
            <button type="submit" class="dvla-hero__cta" disabled>Confirm mileage →</button>
            <button type="button" class="dvla-hero__link" data-action="edit">Not your car?</button>
          </div>
          <p class="dvla-hero__error" data-error="mileage" role="status" aria-live="polite"></p>
        </form>

        <form class="dvla-hero__step is-hidden" data-step="3" data-form="email" novalidate>
          <p class="dvla-hero__step-label">Step 3 of 3</p>
          <h3 class="dvla-hero__step-title">Send your valuation</h3>
          <div class="dvla-hero__summary">
            <div>
              <p class="dvla-hero__summary-label">Vehicle</p>
              <p class="dvla-hero__summary-value" data-summary-vehicle>—</p>
            </div>
            <div>
              <p class="dvla-hero__summary-label">Mileage</p>
              <p class="dvla-hero__summary-value" data-summary-mileage>—</p>
            </div>
          </div>
          <label class="dvla-hero__label" for="dvla-hero-email">Email address</label>
          <input
            id="dvla-hero-email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="name@email.com"
            required
          />
          <p class="dvla-hero__help">We’ll send the best offer and next steps instantly.</p>
          <button type="submit" class="dvla-hero__cta">Get my best offer →</button>
          <p class="dvla-hero__error" data-error="email" role="status" aria-live="polite"></p>
        </form>

        <div class="dvla-hero__status" aria-live="polite">
          <p class="dvla-hero__error" data-error="general"></p>
          <button type="button" class="dvla-hero__retry is-hidden" data-action="retry">Retry lookup</button>
        </div>
      </div>

      <div class="dvla-hero__visual" aria-hidden="true">
        <div class="dvla-hero__visual-glow"></div>
        <div class="dvla-hero__visual-car">
          <span class="dvla-hero__visual-badge">Motorway style</span>
        </div>
      </div>
    </div>
  </div>
</div>`;

  const STORAGE_KEYS = {
    vrm: 'dvla.vrm',
    vehicle: 'dvla.vehicle',
    mileage: 'dvla.mileage',
    email: 'dvla.email',
  };

  const state = {
    step: 1,
    vrm: '',
    vehicle: null,
    mileage: null,
    email: '',
  };

  let lastLookupVrm = '';
  let heroBridgeAttached = false;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(init);

  function init() {
    const hero = document.querySelector('#hero') || document.querySelector('section[role="banner"]');
    if (!hero || hero.querySelector('.dvla-hero')) {
      return;
    }

    const mount = document.createElement('div');
    mount.innerHTML = TEMPLATE.trim();
    const block = mount.firstElementChild;
    if (!block) {
      return;
    }

    hero.insertBefore(block, hero.firstChild);

    const ui = collectUi(block);
    restoreState(ui);
    setStep(determineStep(), ui, { skipAnalytics: true });
    bindEvents(ui);
    setupHeroBridge(ui);
  }

  function collectUi(root) {
    return {
      root,
      progress: root.querySelector('.dvla-hero__progress'),
      stepElements: root.querySelectorAll('[data-step]'),
      forms: {
        vrm: root.querySelector('[data-form="vrm"]'),
        mileage: root.querySelector('[data-form="mileage"]'),
        email: root.querySelector('[data-form="email"]'),
      },
      inputs: {
        vrm: root.querySelector('#dvla-hero-vrm'),
        mileage: root.querySelector('#dvla-hero-mileage'),
        email: root.querySelector('#dvla-hero-email'),
      },
      buttons: {
        vrm: root.querySelector('[data-form="vrm"] .dvla-hero__cta'),
        mileage: root.querySelector('[data-form="mileage"] .dvla-hero__cta'),
        email: root.querySelector('[data-form="email"] .dvla-hero__cta'),
        edit: root.querySelector('[data-action="edit"]'),
        retry: root.querySelector('[data-action="retry"]'),
      },
      displays: {
        plate: root.querySelector('[data-plate]'),
        vehicleLine: root.querySelector('[data-vehicle-line]'),
        summaryVehicle: root.querySelector('[data-summary-vehicle]'),
        summaryMileage: root.querySelector('[data-summary-mileage]'),
      },
      errors: {
        vrm: root.querySelector('[data-error="vrm"]'),
        mileage: root.querySelector('[data-error="mileage"]'),
        email: root.querySelector('[data-error="email"]'),
        general: root.querySelector('[data-error="general"]'),
      },
    };
  }

  function bindEvents(ui) {
    ui.forms.vrm?.addEventListener('submit', (event) => {
      event.preventDefault();
      const vrm = cleanVRM(ui.inputs.vrm?.value || '');
      if (ui.inputs.vrm) {
        ui.inputs.vrm.value = vrm;
      }
      if (!validVRM(vrm)) {
        showError('vrm', 'Enter a valid UK registration (letters & numbers only).', ui);
        ui.inputs.vrm?.focus();
        return;
      }
      state.vrm = vrm;
      saveValue(STORAGE_KEYS.vrm, vrm);
      lookupVehicle(vrm, ui);
    });

    ui.inputs.vrm?.addEventListener('input', () => {
      if (!ui.inputs.vrm) return;
      ui.inputs.vrm.value = cleanVRM(ui.inputs.vrm.value);
      showError('vrm', '', ui);
      showError('general', '', ui);
      toggleRetry(ui, false);
    });

    ui.forms.mileage?.addEventListener('submit', (event) => {
      event.preventDefault();
      const parsed = parseMileage(ui.inputs.mileage?.value || '');
      if (!parsed) {
        showError('mileage', 'Enter a mileage between 1 and 400,000 miles.', ui);
        toggleMileageValidity(ui, false);
        ui.inputs.mileage?.focus();
        return;
      }
      state.mileage = parsed;
      saveValue(STORAGE_KEYS.mileage, String(parsed));
      showError('mileage', '', ui);
      updateSummary(ui);
      setStep(3, ui, { focus: ui.inputs.email });
    });

    ui.inputs.mileage?.addEventListener('input', () => {
      if (!ui.inputs.mileage) return;
      ui.inputs.mileage.value = normaliseMileageInput(ui.inputs.mileage.value);
      const parsed = parseMileage(ui.inputs.mileage.value);
      if (parsed) {
        state.mileage = parsed;
        saveValue(STORAGE_KEYS.mileage, String(parsed));
        toggleMileageValidity(ui, true);
        showError('mileage', '', ui);
      } else {
        state.mileage = null;
        saveValue(STORAGE_KEYS.mileage, null);
        toggleMileageValidity(ui, false);
      }
    });

    ui.inputs.mileage?.addEventListener('blur', () => {
      if (!ui.inputs.mileage) return;
      const parsed = parseMileage(ui.inputs.mileage.value);
      if (parsed) {
        ui.inputs.mileage.value = formatMileage(parsed);
      }
    });

    ui.buttons.edit?.addEventListener('click', () => {
      resetVehicle(ui);
    });

    ui.buttons.retry?.addEventListener('click', () => {
      const vrm = cleanVRM(ui.inputs.vrm?.value || lastLookupVrm);
      if (vrm) {
        if (ui.inputs.vrm) {
          ui.inputs.vrm.value = vrm;
        }
        lookupVehicle(vrm, ui);
      } else {
        ui.inputs.vrm?.focus();
      }
    });

    ui.forms.email?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!state.vehicle || !state.vrm) {
        showError('general', 'Please look up your vehicle first.', ui);
        setStep(1, ui, { focus: ui.inputs.vrm });
        return;
      }
      if (!state.mileage) {
        showError('general', 'Confirm your mileage to continue.', ui);
        setStep(2, ui, { focus: ui.inputs.mileage });
        return;
      }
      if (!ui.inputs.email?.checkValidity()) {
        showError('email', 'Enter a valid email address.', ui);
        ui.inputs.email?.focus();
        return;
      }
      const email = (ui.inputs.email.value || '').trim();
      state.email = email;
      saveValue(STORAGE_KEYS.email, email);
      showError('email', '', ui);
      showError('general', '', ui);
      redirectToAuth();
    });
  }

  function setupHeroBridge(ui) {
    if (heroBridgeAttached) {
      return;
    }
    heroBridgeAttached = true;

    window.addEventListener('dvla:prefill', (event) => {
      handlePrefillRequest(event?.detail?.vrm, ui);
    });

    consumePrefillFromStorage(ui);
  }

  function consumePrefillFromStorage(ui) {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    const queued = storage.getItem('dvla.prefill');
    if (!queued) {
      return;
    }
    storage.removeItem('dvla.prefill');
    handlePrefillRequest(queued, ui);
  }

  function handlePrefillRequest(candidate, ui) {
    const requested = cleanVRM(candidate || '');
    if (!requested) {
      return;
    }

    if (!validVRM(requested)) {
      if (ui.inputs.vrm) {
        ui.inputs.vrm.value = requested;
        ui.inputs.vrm.focus();
      }
      setStep(1, ui, { focus: ui.inputs.vrm });
      showError('vrm', 'Enter a valid UK registration (letters & numbers only).', ui);
      return;
    }

    if (ui.inputs.vrm) {
      ui.inputs.vrm.value = requested;
    }

    state.vrm = requested;
    saveValue(STORAGE_KEYS.vrm, requested);
    showError('vrm', '', ui);
    showError('general', '', ui);
    toggleRetry(ui, false);
    setStep(1, ui, { focus: ui.inputs.vrm });

    if (ui.root?.scrollIntoView) {
      try {
        ui.root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (_) {
        ui.root.scrollIntoView();
      }
    }

    lookupVehicle(requested, ui);
  }

  function lookupVehicle(vrm, ui) {
    lastLookupVrm = vrm;
    showError('general', '', ui);
    showError('vrm', '', ui);
    toggleRetry(ui, false);
    setLoading(ui.buttons.vrm, true);

    fetchVehicle(vrm)
      .then((vehicle) => {
        state.vehicle = vehicle;
        saveValue(STORAGE_KEYS.vehicle, JSON.stringify(vehicle));
        updateVehicleUi(ui);
        updateSummary(ui);
        setStep(2, ui, { focus: ui.inputs.mileage });
      })
      .catch((error) => {
        handleLookupError(error, ui);
      })
      .finally(() => {
        setLoading(ui.buttons.vrm, false);
      });
  }

  function handleLookupError(error, ui) {
    const status = typeof error?.status === 'number' ? error.status : null;
    const message = messageForStatus(status);
    showError('vrm', message, ui);
    showError('general', message, ui);
    toggleRetry(ui, true);
  }

  function restoreState(ui) {
    const storedVrm = readValue(STORAGE_KEYS.vrm);
    const storedVehicle = readValue(STORAGE_KEYS.vehicle, { json: true });
    const storedMileage = readValue(STORAGE_KEYS.mileage);
    const storedEmail = readValue(STORAGE_KEYS.email);

    if (storedVrm) {
      state.vrm = storedVrm;
      if (ui.inputs.vrm) {
        ui.inputs.vrm.value = storedVrm;
      }
    }

    if (storedVehicle) {
      state.vehicle = storedVehicle;
    }

    if (storedMileage) {
      const parsed = parseInt(storedMileage, 10);
      if (!Number.isNaN(parsed)) {
        state.mileage = parsed;
        if (ui.inputs.mileage) {
          ui.inputs.mileage.value = formatMileage(parsed);
        }
        toggleMileageValidity(ui, true);
      }
    }

    if (storedEmail) {
      state.email = storedEmail;
      if (ui.inputs.email) {
        ui.inputs.email.value = storedEmail;
      }
    }

    updateVehicleUi(ui);
    updateSummary(ui);
  }

  function determineStep() {
    if (state.vrm && state.vehicle && state.mileage) {
      return 3;
    }
    if (state.vrm && state.vehicle) {
      return 2;
    }
    return 1;
  }

  function setStep(step, ui, options = {}) {
    state.step = step;
    ui.root?.setAttribute('data-current-step', String(step));
    ui.stepElements.forEach((element) => {
      const elStep = Number(element.getAttribute('data-step'));
      element.classList.toggle('is-hidden', elStep !== step);
    });
    if (ui.progress) {
      ui.progress.setAttribute('data-active-step', String(step));
    }
    if (options.focus) {
      window.requestAnimationFrame(() => {
        options.focus?.focus();
      });
    }
    if (!options.skipAnalytics) {
      try {
        window.dataLayer?.push({ event: 'dvla_step', step, vrm: state.vrm || '' });
      } catch (_) {
        // no-op
      }
    }
  }

  function updateVehicleUi(ui) {
    const plateValue = state.vrm || 'VRM';
    if (ui.displays.plate) {
      ui.displays.plate.textContent = plateValue;
    }
    if (ui.displays.vehicleLine) {
      ui.displays.vehicleLine.textContent = formatVehicleLine(state.vehicle) || 'MAKE MODEL • YEAR • COLOUR • BODY • FUEL';
    }
  }

  function updateSummary(ui) {
    if (ui.displays.summaryVehicle) {
      ui.displays.summaryVehicle.textContent = formatVehicleTitle(state.vehicle) || '—';
    }
    if (ui.displays.summaryMileage) {
      ui.displays.summaryMileage.textContent = state.mileage ? `${formatMileage(state.mileage)} miles` : '—';
    }
  }

  function toggleMileageValidity(ui, isValid) {
    ui.forms.mileage?.classList.toggle('has-valid-mileage', Boolean(isValid));
    if (ui.buttons.mileage) {
      ui.buttons.mileage.disabled = !isValid;
    }
  }

  function resetVehicle(ui) {
    state.vehicle = null;
    state.mileage = null;
    state.email = '';
    saveValue(STORAGE_KEYS.vehicle, null);
    saveValue(STORAGE_KEYS.mileage, null);
    saveValue(STORAGE_KEYS.email, null);
    if (ui.inputs.mileage) {
      ui.inputs.mileage.value = '';
    }
    if (ui.inputs.email) {
      ui.inputs.email.value = '';
    }
    toggleMileageValidity(ui, false);
    updateVehicleUi(ui);
    updateSummary(ui);
    showError('general', '', ui);
    showError('mileage', '', ui);
    setStep(1, ui, { focus: ui.inputs.vrm });
  }

  function showError(key, message, ui) {
    const node = ui.errors[key];
    if (node) {
      node.textContent = message || '';
    }
  }

  function toggleRetry(ui, show) {
    if (ui.buttons.retry) {
      ui.buttons.retry.classList.toggle('is-hidden', !show);
    }
  }

  function redirectToAuth() {
    const redirectPath = `/${state.vrm}?mileage=${state.mileage}`;
    const params = qs({
      clientId: 'seller-web-app',
      redirectUri: encodeURIComponent(redirectPath),
      brand: state.vehicle?.make || '',
      vrm: state.vrm,
      xSpId: uuidv4(),
    });
    window.location.href = `/auth/seller?${params}`;
  }

  function setLoading(button, isLoading) {
    if (!button) return;
    if (isLoading) {
      if (!button.dataset.originalLabel) {
        button.dataset.originalLabel = button.textContent || '';
      }
      const loadingText = button.getAttribute('data-loading-text');
      if (loadingText) {
        button.textContent = loadingText;
      }
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
    } else {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      if (button.dataset.originalLabel) {
        button.textContent = button.dataset.originalLabel;
      }
    }
  }

  function fetchVehicle(vrm) {
    const supabaseUrl = 'https://ggarxjzwywppoqtehvhb.supabase.co';
    const endpoint = `${supabaseUrl}/functions/v1/dvla-lookup?vrm=${encodeURIComponent(vrm)}&env=test`;
    
    return fetch(endpoint, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      if (!response.ok) {
        const error = new Error('DVLA lookup failed');
        error.status = response.status;
        throw error;
      }
      return response.json();
    });
  }

  function cleanVRM(value) {
    return (value || '').toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '').slice(0, 8);
  }

  function validVRM(value) {
    return /^[A-Z0-9]{1,8}$/.test(value);
  }

  function parseMileage(value) {
    const cleaned = (value || '').replace(/,/g, '').trim();
    if (!cleaned || !/^\d+$/.test(cleaned)) {
      return null;
    }
    const miles = Number(cleaned);
    if (!Number.isFinite(miles) || miles < 1 || miles > 400000) {
      return null;
    }
    return miles;
  }

  function normaliseMileageInput(value) {
    return (value || '').replace(/[^\d,]/g, '').replace(/,{2,}/g, ',');
  }

  function formatMileage(value) {
    return Number(value).toLocaleString('en-GB');
  }

  function formatVehicleLine(vehicle) {
    if (!vehicle) {
      return '';
    }
    const headline = [vehicle.make, vehicle.model].filter(Boolean).join(' ').trim();
    const details = [vehicle.year, vehicle.colour, vehicle.body, vehicle.fuel]
      .map((part) => (part == null ? '' : String(part)))
      .filter(Boolean)
      .join(' • ');
    return [headline, details].filter(Boolean).join(' • ');
  }

  function formatVehicleTitle(vehicle) {
    if (!vehicle) {
      return '';
    }
    return [vehicle.make, vehicle.model].filter(Boolean).join(' ').trim();
  }

  function messageForStatus(status) {
    if (status === 404) {
      return 'We could not find that registration. Double-check the plate and try again.';
    }
    if (status === 429) {
      return 'Too many lookups right now. Please wait a moment and retry.';
    }
    if (typeof status === 'number' && status >= 500) {
      return 'DVLA is temporarily unavailable. Please try again shortly.';
    }
    return 'We could not reach the DVLA service. Please try again.';
  }

  function qs(obj) {
    return new URLSearchParams(obj).toString();
  }

  function uuidv4() {
    const cryptoObj = window.crypto || window.msCrypto;
    if (cryptoObj?.randomUUID) {
      return cryptoObj.randomUUID();
    }
    if (cryptoObj?.getRandomValues) {
      const array = new Uint8Array(16);
      cryptoObj.getRandomValues(array);
      array[6] = (array[6] & 0x0f) | 0x40;
      array[8] = (array[8] & 0x3f) | 0x80;
      const hex = Array.from(array, (b) => b.toString(16).padStart(2, '0'));
      return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const rand = (Math.random() * 16) | 0;
      const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  function saveValue(key, value) {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    if (value === null || value === undefined || value === '') {
      storage.removeItem(key);
    } else {
      storage.setItem(key, value);
    }
  }

  function readValue(key, options = {}) {
    const storage = getStorage();
    if (!storage) {
      return null;
    }
    const raw = storage.getItem(key);
    if (raw == null) {
      return null;
    }
    if (options.json) {
      try {
        return JSON.parse(raw);
      } catch (_) {
        return null;
      }
    }
    return raw;
  }

  function getStorage() {
    try {
      return window.sessionStorage;
    } catch (_) {
      return null;
    }
  }
})();
