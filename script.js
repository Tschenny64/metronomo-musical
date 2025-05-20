// ========== PANTALLA DE CONFIGURACIÓN ==========
if (document.getElementById('configForm')) {
  const compasBtns = document.querySelectorAll('.compas-btn');
  const compasInput = document.getElementById('compas');
  const form = document.getElementById('configForm');
  const iniciarBtn = form.querySelector('button[type="submit"]');

  compasBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      compasInput.value = btn.dataset.compas;
      compasBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const bpm = document.getElementById('bpm').value;
    const compas = document.getElementById('compas').value;
    const descanso = parseInt(document.getElementById('descanso').value) || 0;

    localStorage.setItem('bpm', bpm);
    localStorage.setItem('compas', compas);

    if (descanso > 0) {
      iniciarBtn.disabled = true;
      let tiempoRestante = descanso;

      const countdown = setInterval(() => {
        iniciarBtn.textContent = `Iniciando en ${tiempoRestante}s...`;
        tiempoRestante--;

        if (tiempoRestante < 0) {
          clearInterval(countdown);
          window.location.href = "movimiento.html";
        }
      }, 1000);
    } else {
      window.location.href = "movimiento.html";
    }
  });
}

// ========== PANTALLA DE MOVIMIENTO ==========
if (document.getElementById('mano')) {
  const bpm = parseInt(localStorage.getItem('bpm')) || 100;
  const compas = parseInt(localStorage.getItem('compas')) || 4;
  const mano = document.getElementById('mano');
  const tambor = document.getElementById('tambor');
  const efectoGolpe = document.getElementById('efectoGolpe');

  const intervalo = (60 / bpm) * 1000;
  let pulso = 0;
  let animando = false;

  const distancia = 350; // Ajusta si la mano se mueve demasiado
  const duracionAnimacion = intervalo / 2;

  const imagenesTambor = [
    'img/tambor1.jpg',
    'img/tambor2.jpg',
    'img/tambor3.jpg'
  ];
  let golpes = 0;
  let indiceTambor = 0;

  function cambiarTamborCadaNGolpes(n) {
    golpes++;
    if (golpes % n === 0) {
      indiceTambor = (indiceTambor + 1) % imagenesTambor.length;
      tambor.src = imagenesTambor[indiceTambor];
    }
  }

  function mostrarEfectoGolpe() {
    efectoGolpe.classList.add('activo');
    setTimeout(() => {
      efectoGolpe.classList.remove('activo');
    }, 250);
  }

  function animarMovimiento(inicio, fin, duracion, callback) {
    let start = null;

    function moverMano(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progreso = Math.min(elapsed / duracion, 1);
      const posicion = inicio + (fin - inicio) * progreso;
      mano.style.transform = `translateX(-${posicion}px)`;

      if (progreso < 1) {
        requestAnimationFrame(moverMano);
      } else if (callback) {
        callback();
      }
    }

    requestAnimationFrame(moverMano);
  }

  setInterval(() => {
    pulso++;

    if ((pulso - 1) % compas === 0 && !animando) {
      animando = true;

      animarMovimiento(0, distancia, duracionAnimacion, () => {
        mostrarEfectoGolpe();                      // Solo el golpe, sin explosión
        cambiarTamborCadaNGolpes(compas);

        animarMovimiento(distancia, 0, duracionAnimacion, () => {
          animando = false;
        });
      });
    }
  }, intervalo);
}
