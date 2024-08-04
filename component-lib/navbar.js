class Navbar extends HTMLElement {
    connectedCallback() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'style-sheet/navbar.css';
        document.head.appendChild(link);
        this.innerHTML = `

        
            <div class="nav-bar">
                <div class="brand-logo">Kuartist</div>
                    <div class="nav-lnk-lst-wrp">
                    <a class="nav-lnk-txt-wrp" href="index.html">Home</a>
                    <a class="nav-lnk-txt-wrp" href="pages/about.html">About Us</a>
                    <a class="nav-lnk-txt-wrp" href="pages/contact-us.html">Contact Us</a>
                    </div>
            </div>
        `;
    }
}

customElements.define('nav-bar', Navbar);


{/* <header>
<h1>Kuartist</h1>    
<div>
    <a href="index.html">Home</a>
    <a href="pages/about.html">About Us</a>
    <a href="pages/contact-us.html">Contact Us</a>
</div>
</header> */}