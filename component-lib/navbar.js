class Navbar extends HTMLElement {
    connectedCallback() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/style-sheet/navbar.css';
        document.head.appendChild(link);
        this.innerHTML = `
            <div class="nav-bar">
                <div class="brand-logo">Kũartist</div>
                <div class="hamburger" id="hamburger">&#9776;</div>
                <div class="nav-lnk-lst-wrp" id="nav-links">
                    <a class="nav-link-txt" href="/">Home</a>
                    <a class="nav-link-txt" href="/pages/projects.html">Projects</a>
                    <button class="btn-cta" type="button" onclick="window.open('https://forms.zohopublic.in/kuartist/form/Contact/formperma/5qV-E1KQCzdys84bmA-qKmmf3ANvjwQnCJYJvCSvTB0');">Contact Us</button>
                </div>
            </div>
        `;

        // Add event listener for the hamburger menu
        this.querySelector('#hamburger').addEventListener('click', () => {
            const navLinks = this.querySelector('#nav-links');
            navLinks.classList.toggle('active'); // Toggle 'active' class
        });
    }
}

customElements.define('nav-bar', Navbar);