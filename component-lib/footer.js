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
                    <h2 class="footer-heading">Küartist - The Creative Digital Design Studio</h2>
                    <p class="footer-subtext">
                        We are a group of talented freelance digital designers based out in India. 
                        We specialize in creating visually stunning and engaging digital experiences 
                        for businesses and individuals.
                    </p>
                    <p class="footer-subtext">
                        Address - 231/91 a, arcot road, Am.puram, perumugai, vellore - 632009 TN, India
                    </p>
                </div>
                
                <div class="footer-lnk-grp">
                    <div class="footer-section">
                        <h3 class="footer-link-title">Company</h3>
                        <a href="/home" class="footer-link">Home</a>
                        <a href="/projects" class="footer-link">Projects</a>
                        <a href="/shots" class="footer-link">Shots</a>
                        <a href="/about" class="footer-link">About us</a>
                    </div>
                    
                    <div class="footer-section">
                        <h3 class="footer-link-title">Legal</h3>
                        <a href="/privacy" class="footer-link">Privacy policy</a>
                        <a href="/terms" class="footer-link">Terms of use</a>
                        <a href="/cookie-policy" class="footer-link">Cookie policy</a>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Define the custom element
customElements.define('footer-component', FooterComponent);
