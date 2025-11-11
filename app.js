document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const form = document.getElementById('valuation-form');
    const steps = {
        1: document.getElementById('step-1'),
        2: document.getElementById('step-2'),
        3: document.getElementById('step-3'),
    };
    const inputs = {
        vrm: document.getElementById('vrm'),
        mileage: document.getElementById('mileage'),
        email: document.getElementById('email'),
        honeypot: document.getElementById('confirm_email'),
    };
    const errors = {
        vrm: document.getElementById('vrm-error'),
        mileage: document.getElementById('mileage-error'),
        email: document.getElementById('email-error'),
    };
    const summaries = {
        plate: document.getElementById('summary-plate'),
        details: document.getElementById('summary-details'),
    };
    const notYourCarLink = document.getElementById('not-your-car');
    const vrmTick = document.querySelector('.vrm-input__tick');
    const mileageTick = document.querySelector('.mileage-input__tick');

    // --- Configuration ---
    const AUTH_BASE = '/auth/seller';
    const RESULT_BASE = '/';
    const API_BASE = '/api/dvla';

    // --- State Management ---
    let state = {
        currentStep: 1,
        vrm: '',
        vehicleData: null,
        mileage: '',
        email: '',
    };

    const saveState = () => {
        try {
            sessionStorage.setItem('valuationState', JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save state to sessionStorage:', e);
        }
    };

    const loadState = () => {
        try {
            const savedState = sessionStorage.getItem('valuationState');
            if (savedState) {
                state = JSON.parse(savedState);
            }
        } catch (e) {
            console.warn('Could not load state from sessionStorage:', e);
            sessionStorage.removeItem('valuationState');
        }
    };

    // --- Helper Functions ---
    const uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    const cleanVRM = (v) => v.toUpperCase().replace(/\s/g, '');
    const validVRM = (v) => /^[A-Z0-9]{1,8}$/.test(v);
    const parseMileage = (s) => parseInt(s.replace(/,/g, ''), 10);
    const formatMileage = (n) => n.toLocaleString('en-GB');
    const validMileage = (m) => !isNaN(m) && m >= 1 && m <= 400000;
    const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const qs = (params) => new URLSearchParams(params).toString();

    const fireAnalytics = (eventName, data) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: eventName, ...data });
        console.log('Analytics Event:', eventName, data);
    };

    // --- UI Functions ---
    const showStep = (stepNumber) => {
        Object.values(steps).forEach(stepEl => stepEl.classList.add('is-hidden'));
        steps[stepNumber].classList.remove('is-hidden');
        state.currentStep = stepNumber;
        saveState();

        // Autofocus on the input of the new step
        const inputToFocus = steps[stepNumber].querySelector('input, select, textarea');
        if (inputToFocus) {
            inputToFocus.focus();
        }
    };

    const showError = (field, message) => {
        errors[field].textContent = message;
        inputs[field].setAttribute('aria-invalid', 'true');
    };

    const clearError = (field) => {
        errors[field].textContent = '';
        inputs[field].removeAttribute('aria-invalid');
    };

    const setLoading = (button, isLoading) => {
        const buttonText = button.querySelector('.button__text');
        const spinner = button.querySelector('.button__spinner');
        button.disabled = isLoading;
        if (isLoading) {
            buttonText.style.visibility = 'hidden';
            spinner.classList.remove('is-hidden');
        } else {
            buttonText.style.visibility = 'visible';
            spinner.classList.add('is-hidden');
        }
    };

    // --- API Call ---
    const fetchVehicle = async (vrm) => {
        const res = await fetch(`${API_BASE}?vrm=${encodeURIComponent(vrm)}`, { credentials: 'include' });
        if (!res.ok) {
            const error = new Error('DVLA lookup failed');
            error.status = res.status;
            throw error;
        }
        return res.json();
    };

    // --- Event Handlers ---
    const handleStep1Submit = async (e) => {
        const button = e.target.querySelector('button[type="submit"]');
        clearError('vrm');
        const cleanedVrm = cleanVRM(inputs.vrm.value);

        if (!validVRM(cleanedVrm)) {
            showError('vrm', 'Please enter a valid UK number plate.');
            return;
        }

        setLoading(button, true);
        try {
            const vehicleData = await fetchVehicle(cleanedVrm);
            state.vrm = cleanedVrm;
            state.vehicleData = vehicleData;
            fireAnalytics('vrm_lookup_success', { vrm: cleanedVrm, make: vehicleData.make, model: vehicleData.model });
            
            summaries.plate.textContent = vehicleData.vrm;
            summaries.details.textContent = `${vehicleData.make} ${vehicleData.model} • ${vehicleData.year} • ${vehicleData.colour} • ${vehicleData.body} • ${vehicleData.fuel}`;
            
            showStep(2);
        } catch (error) {
            if (error.status === 429) {
                showError('vrm', 'Too many requests. Please try again in a moment.');
            } else {
                showError('vrm', 'Vehicle not found. Please check the number plate and try again.');
            }
        } finally {
            setLoading(button, false);
        }
    };

    const handleStep2Submit = () => {
        clearError('mileage');
        const mileageValue = parseMileage(inputs.mileage.value);

        if (!validMileage(mileageValue)) {
            showError('mileage', 'Please enter a valid mileage between 1 and 400,000.');
            return;
        }
        
        state.mileage = mileageValue;
        fireAnalytics('mileage_confirmed', { mileage: mileageValue });
        showStep(3);
    };

    const handleStep3Submit = () => {
        // Bot trap
        if (inputs.honeypot.value) {
            console.warn('Honeypot field filled. Likely a bot.');
            return; // Fail silently
        }

        clearError('email');
        const emailValue = inputs.email.value;

        if (!validEmail(emailValue)) {
            showError('email', 'Please enter a valid email address.');
            return;
        }

        state.email = emailValue;
        fireAnalytics('lead_email_entered', { email: emailValue });

        const redirectUri = encodeURIComponent(`${RESULT_BASE}${state.vrm}?mileage=${state.mileage}`);
        const authParams = {
            clientId: 'seller-web-app',
            redirectUri: redirectUri,
            brand: state.vehicleData.make,
            vrm: state.vrm,
            xSpId: uuidv4(),
        };

        const finalUrl = `${AUTH_BASE}?${qs(authParams)}`;
        console.log('Redirecting to:', finalUrl);
        // window.location.href = finalUrl;
        alert(`Would redirect to: ${finalUrl}`); // For demonstration
    };

    // --- Input Validation Listeners ---
    inputs.vrm.addEventListener('input', () => {
        const cleanedVrm = cleanVRM(inputs.vrm.value);
        inputs.vrm.value = cleanedVrm;
        if (validVRM(cleanedVrm)) {
            inputs.vrm.classList.add('is-valid');
            clearError('vrm');
        } else {
            inputs.vrm.classList.remove('is-valid');
        }
    });

    inputs.mileage.addEventListener('input', () => {
        // Format with commas as user types
        let value = inputs.mileage.value.replace(/,/g, '');
        if (/^\d*$/.test(value)) {
            inputs.mileage.value = value ? formatMileage(parseInt(value, 10)) : '';
        } else {
            inputs.mileage.value = value.slice(0, -1);
        }

        const mileageValue = parseMileage(inputs.mileage.value);
        if (validMileage(mileageValue)) {
            inputs.mileage.classList.add('is-valid');
            clearError('mileage');
        } else {
            inputs.mileage.classList.remove('is-valid');
        }
    });

    inputs.email.addEventListener('input', () => clearError('email'));

    // --- Main Form Submission Router ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        switch (state.currentStep) {
            case 1:
                handleStep1Submit(e);
                break;
            case 2:
                handleStep2Submit();
                break;
            case 3:
                handleStep3Submit();
                break;
        }
    });

    // --- Navigation ---
    notYourCarLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Clear relevant state but keep VRM for editing
        state.vehicleData = null;
        inputs.vrm.value = state.vrm;
        showStep(1);
        inputs.vrm.select();
    });

    // --- Initialization ---
    const init = () => {
        loadState();
        
        // Restore form fields from state
        if (state.vrm) inputs.vrm.value = state.vrm;
        if (state.mileage) inputs.mileage.value = formatMileage(state.mileage);
        if (state.email) inputs.email.value = state.email;

        // Restore UI to the correct step
        if (state.currentStep > 1 && state.vehicleData) {
            summaries.plate.textContent = state.vehicleData.vrm;
            summaries.details.textContent = `${state.vehicleData.make} ${state.vehicleData.model} • ${state.vehicleData.year} • ${state.vehicleData.colour} • ${state.vehicleData.body} • ${state.vehicleData.fuel}`;
            showStep(state.currentStep);
        } else {
            showStep(1);
        }
    };

    init();
});
