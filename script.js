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
    const tiempoUso = parseInt(document.getElementById('tiempoUso').value) || 0;

    localStorage.setItem('bpm', bpm);
    localStorage.setItem('compas', compas);
    localStorage.setItem('tiempoUso', tiempoUso);
    localStorage.setItem('descanso', descanso);

    window.location.href = "movimiento.html";
  });
}

if (document.getElementById('mano')) {
  const bpm = parseInt(localStorage.getItem('bpm')) || 100;
  const compas = parseInt(localStorage.getItem('compas')) || 4;
  const tiempoUso = parseInt(localStorage.getItem('tiempoUso')) || 0;
  const descanso = parseInt(localStorage.getItem('descanso')) || 0;

  const mano = document.getElementById('mano');
  const tambor = document.getElementById('tambor');
  const efectoGolpe = document.getElementById('efectoGolpe');
  const cuentaRegresiva = document.getElementById('cuentaRegresiva');

  const intervalo = (60 / bpm) * 1000;
  const distancia = 350;
  const duracionAnimacion = intervalo / 2;

  let animando = false;
  let golpes = 0;
  let indiceTambor = 0;
  let tiempoActual = 0;

  const imagenesTambor = ['img/tambor1.png', 'img/tambor2.png', 'img/tambor3.png'];
  tambor.src = imagenesTambor[0];

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

function iniciarAnimacion() {
  const preGolpeDelay = duracionAnimacion; // Empieza a mover antes del golpe

  setInterval(() => {
    tiempoActual = (tiempoActual % 4) + 1;
    const debeGolpear = (compas === 2 && (tiempoActual === 1 || tiempoActual === 3)) ||
                        (compas === 4 && tiempoActual === 1);

    if (debeGolpear) {
      // Mueve la mano justo antes del golpe
      setTimeout(() => {
        animando = true;
        animarMovimiento(0, distancia, duracionAnimacion, () => {
          mostrarEfectoGolpe();
          cambiarTamborCadaNGolpes(1);
          animarMovimiento(distancia, 0, duracionAnimacion, () => {
            animando = false;
          });
        });
      }, intervalo - duracionAnimacion); // Mueve justo para llegar al golpe a tiempo
    }
  }, intervalo);

  if (tiempoUso > 0) {
    setTimeout(() => {
      window.location.href = "index.html";
    }, tiempoUso * 1000);
  }
}


  if (descanso > 0) {
    cuentaRegresiva.style.display = 'block';
    let cuenta = descanso;
    const cuentaInterval = setInterval(() => {
      if (cuenta <= 4) cuentaRegresiva.textContent = cuenta;
      cuenta--;
      if (cuenta < 0) {
        clearInterval(cuentaInterval);
        cuentaRegresiva.style.display = 'none';
        iniciarAnimacion();
      }
    }, 1000);
  } else {
    iniciarAnimacion();
  }
}

function activarPantallaCompleta() {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if (el.msRequestFullscreen) el.msRequestFullscreen();
}

const fullscreenBtn = document.getElementById('fullscreenBtn');

if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      fullscreenBtn.textContent = 'Salir de pantalla completa';
    } else {
      document.exitFullscreen();
      fullscreenBtn.textContent = 'Pantalla completa';
    }
  });
}
