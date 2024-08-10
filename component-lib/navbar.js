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
            <a class="nav-link-txt" href="/">Home</a>
            <a class="nav-link-txt" href="/pages/projects.html">Projects</a>
        </div>
    </div>
`;
    }
}

customElements.define('nav-bar', Navbar);



// class Navbar extends HTMLElement {
//     connectedCallback() {
//         const link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = 'style-sheet/navbar.css';
//         document.head.appendChild(link);
//         this.innerHTML = `

        
//             <div class="nav-bar">
//                 <div class="brand-logo">Kuartist</div>
//                     <div class="nav-lnk-lst-wrp">
//                     <a class="nav-link-txt" href="pages/about.html">About Us</a>
//                     <a class="nav-link-txt" href="pages/contact-us.html">Contact Us</a>
//                     </div>
//             </div>
//         `;
//     }
// }

// customElements.define('nav-bar', Navbar);
