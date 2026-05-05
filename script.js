// ── LOADER ──────────────────────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loader-bar');
    const counter = document.getElementById('loader-counter');
    const name = document.getElementById('loader-name');

    // Animate name in
    gsap.to(name, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(loader, {
                    yPercent: -100,
                    duration: 0.9,
                    ease: 'power4.inOut',
                    onComplete: () => { loader.style.display = 'none'; initAnimations(); }
                });
            }, 300);
        }
        bar.style.width = progress + '%';
        counter.textContent = String(Math.floor(progress)).padStart(3, '0');
    }, 60);
});

// --- MAGNET & CURSOR ---
const cursor = document.getElementById('cursor');
const magneticElements = document.querySelectorAll('.magnetic');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function animateCursor() {
    cursorX = lerp(cursorX, mouseX, 1.0);
    cursorY = lerp(cursorY, mouseY, 1.0);
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = 0.5;

        const moveX = (e.clientX - centerX) * dist;
        const moveY = (e.clientY - centerY) * dist;

        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        cursor.classList.add('magnet');
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        cursor.classList.remove('magnet');
    });
});

// ── STARS
function initStarField() {
    const container = document.getElementById('star-field');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 1, 10000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Criação das Estrelas
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 5000;
    const posArray = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 3000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
        size: 2,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });

    const starMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starMesh);

    function animate() {
        requestAnimationFrame(animate);
        starMesh.rotation.y += 0.001; // Rotação lenta
        starMesh.rotation.x += 0.0005;
        renderer.render(scene, camera);
    }

    animate();

    // Reajusta o tamanho se a janela mudar
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}

document.addEventListener('DOMContentLoaded', initStarField);

// EFFECTS TEXT STARS
let lines;

window.addEventListener("load", () => {

    const section = document.querySelector(".section-stars");
    lines = document.querySelectorAll(".typewriter");

    let currentLine = 0;
    let hasStarted = false;

    function resetTyping() {
        currentLine = 0;

        lines.forEach(el => {
            el.innerHTML = "";
            el.classList.remove("active");
        });
    }

    function typeLine(element, html, speed = 60, callback) {
        let i = 0;

        const parser = document.createElement("div");
        parser.innerHTML = html;

        const text = parser.textContent;

        element.innerHTML = "";
        element.classList.add("active");

        function type() {
            if (i < text.length) {
                element.textContent = text.slice(0, i + 1);
                i++;
                setTimeout(type, speed);
            } else {
                element.innerHTML = html;
                element.classList.remove("active");
                callback && callback();

            if (currentLine >= lines.length) {
                keepCursorOnLastLine();
            }
            }
        }

        type();
    }

    function startTyping() {
if (currentLine >= lines.length) {
    keepCursorOnLastLine();
    return;
}
        const el = lines[currentLine];
        const text = el.getAttribute("data-text");

        typeLine(el, text, 60, () => {
            currentLine++;
            setTimeout(startTyping, 250);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;

                resetTyping();

                setTimeout(() => {
                    startTyping();
                }, 500);
            }

            if (!entry.isIntersecting) {
                hasStarted = false;
            }

        });
    }, {
        threshold: 0.1 // 🔥 sensível (10%)
    });

    observer.observe(section);

    function keepCursorOnLastLine() {
    lines.forEach(el => el.classList.remove("active"));

    const last = lines[lines.length - 1];
    if (last) last.classList.add("active");
}

});

function resetTyping() {
    currentLine = 0;

    lines.forEach(el => {
        el.innerHTML = "";
        el.classList.remove("active");
    });
}

// ── PROJECT ───────────────────────
const container = document.querySelector('.projects-scroll');

document.querySelector('.scroll-btn.right')
.addEventListener('click', () => {
    container.scrollBy({ left: 320, behavior: 'smooth' });
});

document.querySelector('.scroll-btn.left')
.addEventListener('click', () => {
    container.scrollBy({ left: -320, behavior: 'smooth' });
});

// --- TEXT SPLITTING ---
const words = document.querySelectorAll('.hero h1 .word');
words.forEach(word => {
    const text = word.innerText;
    word.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.classList.add('char');

        span.innerHTML = char === ' ' ? '&nbsp;' : char;

        word.appendChild(span);
    });
});


// --- NAVBAR ---
const nav = document.querySelector('.brutal-nav');
let isScrolled = false;

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        if (!isScrolled) {
            nav.classList.add('scrolled');
            isScrolled = true;
        }
    } else {
        if (isScrolled) {
            nav.classList.remove('scrolled');
            nav.style.transform = '';
            isScrolled = false;
        }
    }
});

document.addEventListener('mousemove', (e) => {
    if (!isScrolled) return;
    const cx = window.innerWidth / 2;
    const cy = 100; // Pivot near top

    // Subtle tilt
    const rx = (e.clientY - cy) * 0.02;
    const ry = (e.clientX - cx) * 0.02;

    // Constrain
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    nav.style.transform = `translateX(-50%) perspective(1000px) rotateX(${-clamp(rx, -10, 10)}deg) rotateY(${clamp(ry, -10, 10)}deg)`;
});


// --- HACKER TEXT RE-INIT ---
const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

document.querySelectorAll('[data-text]').forEach(link => {
    link.addEventListener('mouseenter', event => {
        let iter = 0;
        const original = event.target.dataset.text;
        clearInterval(event.target.interval);

        event.target.interval = setInterval(() => {
            event.target.innerText = original.split("")
                .map((l, i) => {
                    if (i < iter) return original[i];
                    return alpha[Math.floor(Math.random() * 26)]
                })
                .join("");

            if (iter >= original.length) clearInterval(event.target.interval);
            iter += 1 / 3;
        }, 30);
    });
    link.addEventListener('mouseleave', e => {
        clearInterval(e.target.interval);
        e.target.innerText = e.target.dataset.text;
    });
});


  // counter animation
const section = document.querySelector('.about-stats');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.querySelectorAll('.stat-num').forEach(el => {

        if (el.classList.contains('animating')) return;

        el.classList.add('animating');

        const target = parseInt(el.dataset.count);
        let current = 0;

        function update() {
          current += target / 40;

          if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
          } else {
            el.textContent = target + '+';
            el.classList.remove('animating');
          }
        }

        update();
      });

    } else {
      // reset quando sair da tela
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        el.textContent = '0';
        el.classList.remove('animating');
      });
    }

  });
}, {
  threshold: 0.6
});

observer.observe(section);

  // ── GITHUB API ────────────────────────────────
async function fetchGitHub() {
    const username = 'gcbieu'; //
    try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (res.ok) {
            const data = await res.json();

            // Repos e Seguidores direto do perfil
            document.getElementById('ghRepos').textContent = data.public_repos || '0';
            document.getElementById('ghFollowers').textContent = data.followers || '0';

            const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
            const reposData = await reposRes.json();
            const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

            document.getElementById('ghStars').textContent = totalStars;
        }
    } catch (e) {
        document.getElementById('ghRepos').textContent = '10+';
        document.getElementById('ghStars').textContent = '5+';
        document.getElementById('ghFollowers').textContent = '10+';
    }
}
fetchGitHub();

// ── CONTRIBUTION GRID GENERATOR ───────────────
function initAnimations() {

    // revela elementos com fade + subida
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach((el, i) => {
        gsap.fromTo(el, 
            { opacity: 0, y: 40 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                delay: i * 0.05,
                ease: 'power3.out'
            }
        );
    });

}
function generateContribGrid() {
  const grid = document.getElementById('contribGrid');
  const weeks = 30;
  const days = 7;

  let html = '<div class="contrib-title">Contribution Activity — 2026</div>';
  let total = 0;

  for (let d = 0; d < days; d++) {
    html += '<div class="contrib-row">';

    for (let w = 0; w < weeks; w++) {
      let rand = Math.random();
      let level = '';

      if (rand > 0.65) { level = 'l1'; total += 1; }
      if (rand > 0.80) { level = 'l2'; total += 2; }
      if (rand > 0.90) { level = 'l3'; total += 3; }
      if (rand > 0.97) { level = 'l4'; total += 4; }

      html += `<div class="contrib-cell ${level}"></div>`;
    }

    html += '</div>';
  }

  if (total < 120) {
    total = 120 + Math.floor(Math.random() * 80); // entre 120 e 200
  }

  grid.innerHTML = html;

}

generateContribGrid();

// ── FORM ──────────────────────────────────────
const form = document.getElementById("my-form");
const status = document.getElementById("form-status");
const btn = form.querySelector(".form-submit");

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  btn.innerHTML = "<span>Enviando...</span>";

  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      status.innerHTML = "✓ Mensagem enviada!";
      form.reset();
      btn.innerHTML = "<span>Enviado ✓</span>";
    } else {
      status.innerHTML = "Erro ao enviar.";
      btn.innerHTML = "<span>Tentar novamente</span>";
    }

  } catch (error) {
    status.innerHTML = "Erro de conexão.";
    btn.innerHTML = "<span>Tentar novamente</span>";
  }
});