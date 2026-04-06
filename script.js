        // Inicializa AOS
        AOS.init({ duration: 1000, once: true });

        // Inicializa Partículas
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80 },
                "color": { "value": "#0891b2" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.3 },
                "size": { "value": 3 },
                "line_linked": { "enable": true, "distance": 150, "color": "#0891b2", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 2 }
            },
            "interactivity": {
                "events": { "onhover": { "enable": true, "mode": "repulse" } }
            }
        });
    
    //LÓGICA
        const form = document.getElementById("my-form");
        const modal = document.getElementById("success-modal");
        const submitBtn = document.getElementById("submit-btn");

        async function handleSubmit(event) {
            event.preventDefault();
            const status = document.getElementById("status");
            const data = new FormData(event.target);
            
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50');
            submitBtn.innerHTML = "<i class='fas fa-circle-notch animate-spin'></i> <span>ENVIANDO...</span>";

            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    modal.style.display = "flex";
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-50');
                    submitBtn.innerHTML = "<i class='fas fa-paper-plane'></i> <span>ENVIAR MENSAGEM</span>";
                } else {
                    response.json().then(data => {
                        status.innerHTML = "Erro ao enviar. Tenta novamente.";
                        status.className = "mt-6 text-sm font-bold text-red-500";
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-50');
                        submitBtn.innerHTML = "<i class='fas fa-paper-plane'></i> <span>ENVIAR MENSAGEM</span>";
                    })
                }
            }).catch(error => {
                status.innerHTML = "Problema de conexão.";
                status.className = "mt-6 text-sm font-bold text-red-500";
            });
        }

        form.addEventListener("submit", handleSubmit);

        function closeModal() {
            modal.style.display = "none";
            document.getElementById("status").innerHTML = "";
        }
