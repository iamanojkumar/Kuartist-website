class Navbar extends HTMLElement {
    connectedCallback() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/style-sheet/navbar.css';
        document.head.appendChild(link);
        this.innerHTML = `
            <div class="nav-bar">
                <a href="/" class="brand-logo">Kũ</a>
                <div class="hamburger" id="hamburger">&#9776;</div>
                <div class="nav-lnk-lst-wrp" id="nav-links">
                    <a class="nav-link-txt" href="/pages/projects.html">Projects</a>
                    <button class="btn-cta" type="button" onclick="window.open('https://forms.zohopublic.in/kuartist/form/Contactdetails/formperma/3JmQ9SKisg_iPNpZ9-XnxD06XBt5IY1kbn35muDcRO0');">Contact Us</button>
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