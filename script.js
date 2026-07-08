// ==========================================
// AOS ANIMAÇÕES
// ==========================================
AOS.init({
    once: true,
    mirror: false
});

// ==========================================
// SELEÇÃO DE ELEMENTOS DO DOM
// ==========================================
const tracksContainer = document.querySelector('.rainbow-tracks-container');
const wrapper = document.querySelector('.hero-image-wrapper');
const configBtn = document.getElementById('config-btn');
const configModal = document.getElementById('config-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalContent = document.querySelector('.modal-content');
const modalHeader = modalContent.querySelector('h3');

const inputWidth = document.getElementById('input-width');
const inputRadius = document.getElementById('input-radius');
const inputQuantity = document.getElementById('input-quantity');

const valWidth = document.getElementById('val-width');
const valRadius = document.getElementById('val-radius');
const valQuantity = document.getElementById('val-quantity');

// Elementos do Menu de Nuvens
const menuToggle = document.getElementById('menu-toggle');
const cloudMenu = document.getElementById('cloud-menu');
const cloudBackdrop = document.getElementById('cloud-backdrop');
const menuLinks = document.querySelectorAll('.menu-link');

// Elementos de Tema
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');
const themeText = themeToggleBtn.querySelector('span');

// ==========================================
// CONFIGURAÇÕES DO ARCO-ÍRIS (MEIO CÍRCULO)
// ==========================================
let config = {
    width: 14,
    borderRadius: 20,
    quantity: 24,       // Quantidade ideal de traços para preencher os 180 graus
    radius: 230         // Raio do Arco-Íris no Desktop
};

// Se for mobile, diminui o raio do arco dinamicamente
if (window.innerWidth <= 900) {
    config.radius = 150;
}
// Repassa o valor do raio como variável CSS para que a foto o acompanhe na ponta
document.documentElement.style.setProperty('--arc-radius', `${config.radius}px`);

const colors = ['#ff0055', '#ff5500', '#ffcc00', '#00ff66', '#00ccff', '#9900ff'];

function generateRainbow() {
    tracksContainer.innerHTML = '';
    
    // Injeta a propriedade CSS atualizada
    document.documentElement.style.setProperty('--arc-radius', `${config.radius}px`);

    for (let i = 0; i < config.quantity; i++) {
        const track = document.createElement('div');
        track.classList.add('rainbow-track');

        // MATEMÁTICA DO MEIO CÍRCULO:
        // Distribuímos os ângulos de 180º a 360º (PI a 2*PI radianos), gerando o semicírculo superior.
        const percent = i / (config.quantity - 1);
        const angle = Math.PI + (percent * Math.PI); 

        const offsetX = Math.cos(angle) * config.radius;
        const offsetY = Math.sin(angle) * config.radius;
        const colorIndex = Math.floor(percent * (colors.length - 1));

        track.style.setProperty('--track-color', colors[colorIndex]);
        track.style.setProperty('--track-w', `${config.width}px`);
        track.style.setProperty('--track-r', `${config.borderRadius}px`);
        track.style.setProperty('--offset-x', `${offsetX}px`);
        track.style.setProperty('--offset-y', `${offsetY}px`);

        // Rotaciona cada barra perpendicularmente à curva do arco
        track.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${angle + Math.PI / 2}rad)`;
        tracksContainer.appendChild(track);
    }
}
generateRainbow();

// Interação Dinâmica: Barras olham para o ponteiro do Mouse
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function updateTrackRotations() {
    const rect = tracksContainer.getBoundingClientRect();
    if (rect.width === 0) return;

    // Centro da base do arco-íris
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const allTracks = document.querySelectorAll('.rainbow-track');

    allTracks.forEach((track, index) => {
        const percent = index / (config.quantity - 1);
        const baseAngle = Math.PI + (percent * Math.PI);

        const trackX = centerX + Math.cos(baseAngle) * config.radius;
        const trackY = centerY + Math.sin(baseAngle) * config.radius;

        const dx = mouseX - trackX;
        const dy = mouseY - trackY;
        
        // Calcula o ângulo em direção ao mouse
        const targetAngle = Math.atan2(dy, dx) + Math.PI / 2;

        const offsetX = Math.cos(baseAngle) * config.radius;
        const offsetY = Math.sin(baseAngle) * config.radius;

        track.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${targetAngle}rad)`;
    });
}

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateTrackRotations();
});

// Reajuste em mudanças de tela (Responsividade)
window.addEventListener('resize', () => {
    config.radius = window.innerWidth <= 900 ? 150 : 230;
    generateRainbow();
    updateTrackRotations();
});

// Ouvintes dos Sliders do Modal
inputWidth.addEventListener('input', (e) => {
    config.width = parseInt(e.target.value);
    valWidth.innerText = `${config.width}px`;
    generateRainbow();
    updateTrackRotations();
});

inputRadius.addEventListener('input', (e) => {
    config.borderRadius = parseInt(e.target.value);
    valRadius.innerText = `${config.borderRadius}px`;
    generateRainbow();
    updateTrackRotations();
});

inputQuantity.addEventListener('input', (e) => {
    config.quantity = parseInt(e.target.value);
    valQuantity.innerText = config.quantity;
    generateRainbow();
    updateTrackRotations();
});

// ==========================================
// CONTROLE DO MENU DE NUVENS
// ==========================================
function toggleMenu() {
    const isActive = cloudMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
}

menuToggle.addEventListener('click', toggleMenu);
cloudBackdrop.addEventListener('click', toggleMenu);
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(toggleMenu, 150);
    });
});

// ==========================================
// PERSISTÊNCIA E ALTERNÂNCIA DE TEMA
// ==========================================
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    updateThemeUI(true);
}

themeToggleBtn.addEventListener('click', () => {
    const isLightNow = document.body.classList.toggle('light-mode');
    localStorage.setItem('portfolio-theme', isLightNow ? 'light' : 'dark');
    updateThemeUI(isLightNow);
    
    // Corrige bordas do avatar instantaneamente na troca de tema
    const avatar = document.querySelector('.hero-avatar');
    if(avatar) avatar.style.borderColor = isLightNow ? '#f9fafb' : '#0b0f19';
});

function updateThemeUI(isLight) {
    if (isLight) {
        themeIcon.className = 'fas fa-sun';
        themeText.innerText = 'Modo Claro';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeText.innerText = 'Modo Escuro';
    }
}

// ==========================================
// COMPORTAMENTO DO MODAL CONFIGURADOR (DRAG)
// ==========================================
configBtn.addEventListener('click', () => {
    configModal.classList.add('active');
    const left = (window.innerWidth - modalContent.offsetWidth) / 2;
    const top = (window.innerHeight - modalContent.offsetHeight) / 2;
    modalContent.style.left = `${left}px`;
    modalContent.style.top = `${top}px`;
});

closeModalBtn.addEventListener('click', () => { configModal.classList.remove('active'); });
configModal.addEventListener('click', (e) => { if (e.target === configModal) configModal.classList.remove('active'); });

let isDragging = false;
let startX, startY, initialLeft, initialTop;

modalHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = modalContent.offsetLeft;
    initialTop = modalContent.offsetTop;
    modalHeader.style.cursor = 'grabbing';
    e.preventDefault();
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    const maxX = window.innerWidth - modalContent.offsetWidth;
    const maxY = window.innerHeight - modalContent.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxX));
    newTop = Math.max(0, Math.min(newTop, maxY));

    modalContent.style.left = `${newLeft}px`;
    modalContent.style.top = `${newTop}px`;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    modalHeader.style.cursor = 'move';
});