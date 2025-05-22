// --- CONFIGURACIÓN ---
if (document.getElementById('configForm')) {
  const compasBtns = document.querySelectorAll('.compas-btn');
  const compasInput = document.getElementById('compas');
  const form = document.getElementById('configForm');
  const iniciarBtn = form.querySelector('button[type="submit"]');

  // Gestión de selección del compás
  compasBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      compasInput.value = btn.dataset.compas;
      compasBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Al enviar el formulario
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const bpm = document.getElementById('bpm').value;
    const compas = document.getElementById('compas').value;
    const descanso = parseInt(document.getElementById('descanso').value) || 0;
    const tiempoUso = parseInt(document.getElementById('tiempoUso').value) || 0;

    // Guardar en localStorage
    localStorage.setItem('bpm', bpm);
    localStorage.setItem('compas', compas);
    localStorage.setItem('tiempoUso', tiempoUso);

    // Si hay tiempo de descanso, mostrar cuenta regresiva
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

// --- MOVIMIENTO ---
if (document.getElementById('mano')) {
  const bpm = parseInt(localStorage.getItem('bpm')) || 100;
  const compas = parseInt(localStorage.getItem('compas')) || 4;
  const tiempoUso = parseInt(localStorage.getItem('tiempoUso')) || 0;

  const mano = document.getElementById('mano');
  const tambor = document.getElementById('tambor');
  const efectoGolpe = document.getElementById('efectoGolpe');

  const intervalo = (60 / bpm) * 1000; // Tiempo entre golpes
  let animando = false;

  const distancia = 350; // Recorrido de la mano en px
  const duracionAnimacion = intervalo / 2; // Mitad del intervalo para ida o vuelta

  const imagenesTambor = [
    'img/tambor1.png',
    'img/tambor2.png',
    'img/tambor3.png'
  ];
  let golpes = 0;
  let indiceTambor = 0;
  tambor.src = imagenesTambor[0];

  // Cambia la imagen del tambor cada N golpes
  function cambiarTamborCadaNGolpes(n) {
    golpes++;
    if (golpes % n === 0) {
      indiceTambor = (indiceTambor + 1) % imagenesTambor.length;
      tambor.src = imagenesTambor[indiceTambor];
    }
  }

  // Muestra un efecto visual de golpe
  function mostrarEfectoGolpe() {
    efectoGolpe.classList.add('activo');
    setTimeout(() => {
      efectoGolpe.classList.remove('activo');
    }, 250);
  }

  // Función de animación de la mano
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

  // Inicia el golpeo en bucle según el intervalo
  setInterval(() => {
    if (!animando) {
      animando = true;

      // Animación hacia adelante
      animarMovimiento(0, distancia, duracionAnimacion, () => {
        mostrarEfectoGolpe();
        cambiarTamborCadaNGolpes(1);

        // Animación de regreso
        animarMovimiento(distancia, 0, duracionAnimacion, () => {
          animando = false;
        });
      });
    }
  }, intervalo);

  // Finaliza y vuelve al index después del tiempo de uso
  if (tiempoUso > 0) {
    setTimeout(() => {
      window.location.href = "index.html";
    }, tiempoUso * 1000);
  }
}
