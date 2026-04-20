/* =============================================
   ESPAÇO EBENEZER — Scripts
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------
     SCROLL SUAVE PARA ÂNCORAS
     ------------------------------------------ */
  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Botões CTA de scroll
  document.querySelectorAll('[data-scroll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-scroll');
      scrollTo(target);
      closeMobileMenu();
    });
  });

  // Links da nav desktop e mobile
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const target = link.getAttribute('href').replace('#', '');
      if (target) {
        e.preventDefault();
        scrollTo(target);
        closeMobileMenu();
      }
    });
  });

  /* ------------------------------------------
     MENU MOBILE (HAMBURGER)
     ------------------------------------------ */
  const hamburger = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('nav-mobile-drawer');

  function closeMobileMenu() {
    if (hamburger && drawer) {
      hamburger.classList.remove('active');
      drawer.classList.remove('open');
    }
  }

  if (hamburger && drawer) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      drawer.classList.toggle('open');
    });

    // Fecha ao clicar fora
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !drawer.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  /* ------------------------------------------
     NAV — SOMBRA AO ROLAR
     ------------------------------------------ */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });

  /* ------------------------------------------
     FORMULÁRIO DE ORÇAMENTO — ENVIO VIA WHATSAPP
     ------------------------------------------ */
  const form = document.getElementById('orcamento-form');

  if (form) {

    // ── Radio cards de pacote ────────────────────
    const radioCards = form.querySelectorAll('.pacote-radio-card');
    const hiddenPacote = document.getElementById('f-pacote');

    radioCards.forEach(function (card) {
      card.addEventListener('click', function () {
        radioCards.forEach(function (c) {
          c.classList.remove('selected', 'invalid');
        });
        card.classList.add('selected');
        hiddenPacote.value = card.getAttribute('data-value');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('f-nome');
      const email = document.getElementById('f-email');
      const pacote = document.getElementById('f-pacote');
      const formato = document.getElementById('f-formato');
      const pessoas = document.getElementById('f-pessoas');

      // Validação: campos de texto + select
      let valid = true;
      [nome, email, formato, pessoas].forEach(function (field) {
        const empty = !field.value.trim();
        const badEmail = field.type === 'email' && !field.value.includes('@');
        if (empty || badEmail) {
          field.classList.add('invalid');
          valid = false;
        } else {
          field.classList.remove('invalid');
        }
      });

      // Validação do pacote (radio cards)
      if (!hiddenPacote.value.trim()) {
        radioCards.forEach(function (c) { c.classList.add('invalid'); });
        valid = false;
      }

      if (!valid) return;

      // Monta mensagem para WhatsApp
      const msg = [
        '🏛️ *Solicitação de Orçamento — Espaço Ebenezer*',
        '',
        `👤 *Nome:* ${nome.value.trim()}`,
        `📧 *E-mail:* ${email.value.trim()}`,
        `📦 *Pacote de interesse:* ${pacote.value}`,
        `🪑 *Formato de sala:* ${formato.value}`,
        `👥 *Quantidade de pessoas:* ${pessoas.value}`,
        '',
        'Olá, gostaria de receber uma proposta personalizada para o meu evento!'
      ].join('\n');

      const phone = '5541997810130'; // (41) 99781-0130
      const url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);

      window.open(url, '_blank');

      // Feedback visual
      form.reset();
      hiddenPacote.value = '';
      radioCards.forEach(function (c) { c.classList.remove('selected', 'invalid'); });
      [nome, email, formato, pessoas].forEach(function (f) {
        f.classList.remove('invalid');
      });

      let successEl = document.getElementById('form-success-msg');
      if (!successEl) {
        successEl = document.createElement('p');
        successEl.id = 'form-success-msg';
        successEl.className = 'form-success';
        successEl.textContent = '✓ Solicitação enviada! Continue no WhatsApp para finalizar.';
        form.parentNode.insertBefore(successEl, form);
      }
      successEl.style.display = 'block';
      setTimeout(function () { successEl.style.display = 'none'; }, 6000);
    });

    // Remove classe invalid ao digitar
    form.querySelectorAll('input, select').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('invalid');
      });
    });
  }

});
