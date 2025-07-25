class Navbar extends HTMLElement {
    connectedCallback() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/style-sheet/navbar.css';
        document.head.appendChild(link);
        this.innerHTML = `
            <div class="nav-bar" id="nav-bar">
            <a href="/" class="brand-logo"">
                <img src="https://i.postimg.cc/T3yPCq96/mellon-full-logo.png" alt="Logo" class="logo-desktop" style="height:24px;display:inline;">
                <img src="https://i.postimg.cc/zfKG1z62/favicon.png" alt="Logo" class="logo-mobile" style="height:40px;display:none;">
            </a>
            <div class="hamburger" id="hamburger">&#9776;</div>
            <div class="nav-lnk-lst-wrp" id="nav-links">
                
                <a class="nav-link-txt" href="https://forms.zohopublic.in/kuartist/form/Contactdetails/formperma/3JmQ9SKisg_iPNpZ9-XnxD06XBt5IY1kbn35muDcRO0">Get in touch!</a>
                
            </div>
            </div>
        `;
         
        
        // Add event listener for the hamburger menu
        this.querySelector('#hamburger').addEventListener('click', () => {
            const navLinks = this.querySelector('#nav-links');
            navLinks.classList.toggle('active'); // Toggle 'active' class
        });

        // Trigger fade-in effect
        setTimeout(() => {
            const navBar = this.querySelector('#nav-bar');
            navBar.classList.add('fade-in'); // Add fade-in class after a short delay
        }, 100); // Delay to ensure the element is rendered before applying the class
    }
}

customElements.define('nav-bar', Navbar);

{/* <button class="btn-cta" type="button" onclick="window.open('https://forms.zohopublic.in/kuartist/form/Contactdetails/formperma/3JmQ9SKisg_iPNpZ9-XnxD06XBt5IY1kbn35muDcRO0');">Contact Us</button> */}

{/* <a class="nav-link-txt" href="/pages/projects.html">Projects</a> */}