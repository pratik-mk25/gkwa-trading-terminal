// NeoTrader Public Landing Page Scripts

document.addEventListener("DOMContentLoaded", () => {
    initTickerWebSocket();
    initDemoModal();
    initFaqAccordion();
    initMobileMenu();
});

// WebSocket Live Ticker Connection
function initTickerWebSocket() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/ticker`;
    
    function connect() {
        const ws = new WebSocket(wsUrl);
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "ticker_update" && data.data) {
                    updateTickerDOM(data.data);
                }
            } catch (err) {
                console.error("Ticker parsing error:", err);
            }
        };

        ws.onclose = () => {
            // Reconnect after 3 seconds if disconnected
            setTimeout(connect, 3000);
        };
    }

    connect();
}

function updateTickerDOM(items) {
    const track = document.getElementById("tickerTrack");
    if (!track) return;

    let html = "";
    // Double items for seamless endless scroll
    const doubled = [...items, ...items];
    doubled.forEach(item => {
        const sign = item.chg >= 0 ? "+" : "";
        const colorClass = item.is_up ? "val-up" : "val-down";
        const icon = item.is_up ? "▲" : "▼";
        html += `
            <div class="ticker-item">
                <span class="sym">${item.symbol}</span>
                <span class="val ${colorClass}">₹${item.ltp.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                <span class="${colorClass}">${icon} ${sign}${item.chg_pct}%</span>
            </div>
        `;
    });
    track.innerHTML = html;
}

// Demo Booking Modal Popup
function initDemoModal() {
    const modal = document.getElementById("demoModal");
    const openBtns = document.querySelectorAll(".btn-open-demo");
    const closeBtn = document.getElementById("closeDemoModal");
    const demoForm = document.getElementById("demoBookingForm");

    if (!modal) return;

    openBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            modal.style.display = "flex";
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    if (demoForm) {
        demoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = demoForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = "Processing...";
            submitBtn.disabled = true;

            const payload = {
                name: document.getElementById("demoName").value,
                phone: document.getElementById("demoPhone").value,
                country_code: document.getElementById("demoCountryCode") ? document.getElementById("demoCountryCode").value : "+91",
                email: document.getElementById("demoEmail").value
            };

            try {
                const res = await fetch("/api/book-demo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const result = await res.json();

                if (result.status === "success") {
                    if (window.Swal) {
                        Swal.fire({
                            icon: "success",
                            title: "Demo Access Unlocked!",
                            text: result.message,
                            background: "#1a1e2e",
                            color: "#fff",
                            confirmButtonColor: "#33D6AD"
                        });
                    } else {
                        alert(result.message);
                    }
                    modal.style.display = "none";
                    demoForm.reset();
                }
            } catch (err) {
                alert("Failed to submit. Please try again.");
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// FAQ Accordion
function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const header = item.querySelector(".faq-header");
        if (header) {
            header.addEventListener("click", () => {
                const isOpen = item.classList.contains("active");
                faqItems.forEach(i => i.classList.remove("active"));
                if (!isOpen) {
                    item.classList.add("active");
                }
            });
        }
    });
}

// Mobile Hamburger Menu
function initMobileMenu() {
    const toggle = document.getElementById("mobileMenuToggle");
    const drawer = document.getElementById("mobileDrawer");
    const close = document.getElementById("closeMobileDrawer");

    if (toggle && drawer) {
        toggle.addEventListener("click", () => {
            drawer.classList.remove("hidden");
        });
    }
    if (close && drawer) {
        close.addEventListener("click", () => {
            drawer.classList.add("hidden");
        });
    }
}
