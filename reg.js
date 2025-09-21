document.addEventListener('DOMContentLoaded', () => {
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step-progress');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    let currentStep = 0;

    // Function to show the current step and update progress bar
    const showStep = (stepIndex) => {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= stepIndex);
        });
    };
    

    // Event listener for "Next" buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentFormStep = formSteps[currentStep];
            const requiredInputs = currentFormStep.querySelectorAll('[required]');
            let isValid = true;

            // Simple validation for required fields
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (isValid) {
                currentStep++;
                if (currentStep < formSteps.length) {
                    showStep(currentStep);
                }
            } else {
                alert('Please fill in all required fields.');
            }
        });
    });

    // Event listener for "Previous" buttons
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            if (currentStep >= 0) {
                showStep(currentStep);
            }
        });
    });

    // Initial load: show the first step
    showStep(currentStep);



    
    // --- Razorpay Payment Button success handler ---
// Razorpay redirects back to your page after successful payment.
// Configure this redirect URL in Razorpay Dashboard → Payment Buttons.
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("razorpay_payment_id")) {
        // Payment was successful (Razorpay adds ?razorpay_payment_id=xxxx)
        console.log("Payment successful with ID:", urlParams.get("razorpay_payment_id"));

        // Jump user directly to Step 3 (success)
        currentStep = formSteps.length - 1;
        showStep(currentStep);

        // Generate registration ID, QR code, certificate, etc.
        finalizeRegistration();


        // ---------- QR Generation ---------
        function finalizeRegistration() {
    // Collect values (defensive: use optional chaining)
    const fullName = (document.getElementById('fullName') || {}).value?.trim() || '';
    const collegeName = (document.getElementById('collegeName') || {}).value?.trim() || '';
    const branch = (document.getElementById('branch') || {}).value?.trim() || '';
    const usn = (document.getElementById('usn') || {}).value?.trim() || '';
    const mobileNumber = (document.getElementById('mobileNumber') || {}).value?.trim() || '';
    const email = (document.getElementById('email') || {}).value?.trim() || '';
    const eventSelected = (document.getElementById('event') || {}).value?.trim() || '';

    // Create unique registration ID
    const regId = 'REG' + Date.now().toString().slice(-8);

    // Show Registration ID on page (element must exist in your HTML)
    const regIdDisplay = document.getElementById('regIdDisplay');
    if (regIdDisplay) regIdDisplay.innerText = `Registration ID: ${regId}`;

    // Compact JSON payload to embed in QR (compact = smaller QR)
    const payload = {
        id: regId,
        n: fullName,
        u: usn,
        e: eventSelected,
        c: collegeName,
        b: branch,
        m: mobileNumber,
        em: email,
        ts: Date.now()
    };
    const qrData = JSON.stringify(payload);

    // QR container - clear any previous QR
    const qrContainer = document.getElementById('qrCodeContainer');
    qrContainer.innerHTML = '';

    // Generate QR using the offline library qrcode.min.js
    // NOTE: QRCode is provided by qrcode.min.js (must be included before this script)
    const qrcode = new QRCode(qrContainer, {
        text: qrData,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Prepare download link once the library has rendered the QR.
    // qrcode.min.js may output an <img> or <canvas>, so handle both.
    setTimeout(() => {
        let dataUrl = null;
        const img = qrContainer.querySelector('img');
        const canvas = qrContainer.querySelector('canvas');

        if (img && img.src && img.src.startsWith('data:')) {
            dataUrl = img.src;
        } else if (canvas && typeof canvas.toDataURL === 'function') {
            dataUrl = canvas.toDataURL('image/png');
        } else {
            // as a fallback, try converting the first child (if it's an SVG or table)
            // Most modern qrcode.min.js builds an img/canvas, so this block should rarely run.
            console.warn('Could not find img or canvas inside QR container; download might not be available in this browser build.');
        }

        // Set download anchor
        const downloadQRBtn = document.getElementById('downloadQR');
        if (downloadQRBtn && dataUrl) {
            downloadQRBtn.href = dataUrl;
            downloadQRBtn.setAttribute('download', `${regId}_qr.png`);
            downloadQRBtn.style.display = 'inline-block'; // ensure visible
        }

        // Save registration data globally if needed elsewhere
        window.registrationData = payload;
    }, 200); // 200ms is usually enough; increase to 500 if needed
}

    }
});

});