class FooterComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <footer class="footer-container">
                <div class="footer-section">
                    <h2 class="footer-heading stagger-text">Küartist - The Creative Digital Design Studio</h2>
                    <p class="footer-subtext">
                        We are a group of talented freelance digital designers based out in India. 
                        We specialize in creating visually stunning and engaging digital experiences 
                        for businesses and individuals.
                    </p>
                </div>
                
                <div class="footer-lnk-grp">
                    <div class="footer-section">
                        <h3 class="footer-link-title stagger-text">Company</h3>
                        <a href="/" class="footer-link stagger-text">Home</a>
                        <a href="/pages/projects.html" class="footer-link stagger-text">Projects</a>
                        <a href="/pages/about.html" class="footer-link stagger-text">About us</a>
                        <a href="/pages/exp/playground.html" class="footer-link stagger-text">Playground</a>
                    </div>
                    
                    <div class="footer-section">
                        <h3 class="footer-link-title stagger-text">Legal</h3>
                        <a href="/pages/legal/privacy-policy.html" class="footer-link stagger-text">Privacy policy</a>
                        <a href="/pages/legal/terms-of-service.html" class="footer-link stagger-text">Terms of service</a>
                        <a href="/pages/legal/cookie-policy.html" class="footer-link stagger-text">Cookie policy</a>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Define the custom element
customElements.define('footer-component', FooterComponent);
