class Character {
    constructor(category, left, bottom, speed, normalImage, hoverImage, onDragging, onDropping) {
        this.category = category;
        this.left = left;
        this.top = 0;
        this.bottom = bottom;
        this.speed = speed;
        this.removed = false;
        this._normalImage = normalImage;

        this.dragging = false;
        this.releasing = false;

        this._el = document.createElement('img');
        this._el.src = normalImage.src;
        this._el.setAttribute('draggable', 'false');
        this._el.setAttribute('class', 'character');

        this._el.style.left = `${left}px`;
        this._el.style.bottom = `${bottom}px`;

        this._el.addEventListener('mouseover', () => {
            this._el.src = hoverImage.src;

            this._el.style.cursor = 'pointer';
            this._el.style.animationName = 'none';
        });

        this._el.addEventListener('mouseout', () => {
            this._el.src = normalImage.src;

            this._el.style.cursor = 'default';
            this._el.style.animationName = 'bumpy';
        });

        this._el.addEventListener('mousedown', () => {
            this.top = this._el.offsetTop;
            this.dragging = true;

            onDragging(this);
        });

        this._el.addEventListener('mouseup', event => {
            this.dragging = false;
            this._release();

            onDropping(event.x, event.y);
        });
    }

    updateLocation(x, y, containerHeight) {
        this.left = x;
        this._el.style.left = `${this.left - this._el.offsetWidth / 2}px`;

        if (y < containerHeight - this._el.offsetHeight)
            this._el.style.top = `${y - this._el.offsetHeight / 2}px`;
    }

    addTo(container) {
        container.appendChild(this._el);
    }

    removeFrom(container) {
        container.removeChild(this._el);
    }

    _release() {
        this.releasing = true;
        this._el.style.cursor = 'default';

        this._el.src = this._normalImage.src;
        this._el.style.marginTop = '0';

        this.left = this._el.offsetLeft;

        $(this._el).animate({
            top: this.top
        }, 400, 'easeOutExpo', () => {
            this._el.style.animationName = 'bumpy';
            this.releasing = false;
        });
    }

    act(timeElapsed) {
        this.left -= this.speed * timeElapsed / 1000;
        this._el.style.left = `${this.left}px`;
    }
}