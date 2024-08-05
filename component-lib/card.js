class CardComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="crd">
                <div class="crd-head">
                    <div class="crd-title-wrp">
                        <span class="material-symbols-outlined">
                            ${this.getAttribute('icon')}
                        </span>
                        <p class="crd-ttl">${this.getAttribute('title')}</p>
                    </div>
                </div>
                <p class="crd-des">${this.getAttribute('description')}</p>
                <a href="${this.getAttribute('link')}" class="crd-link">${this.getAttribute('link-text')}</a>
            </div>
        `;
    }
}

customElements.define('card-component', CardComponent);
