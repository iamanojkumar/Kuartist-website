class Navbar extends HTMLElement {
    connectedCallback() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/style-sheet/navbar.css';
        document.head.appendChild(link);
        this.innerHTML = `
    <div class="nav-bar">
        <div class="brand-logo">Kũartist</div>
        <div class="nav-lnk-lst-wrp">
            <a class="nav-link-txt" href="/">Home</a>
            <a class="nav-link-txt" href="/pages/projects.html">Projects</a>
            <button class="btn-cta" type="button" onclick="window.open('https://forms.zoho.in/kuartist/form/Contact');">Contact Us</button>
        </div>
    </div>
`;
    }
}

customElements.define('nav-bar', Navbar);
