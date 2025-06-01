const form = document.getElementById('form-agenda');
const agendaDiv = document.getElementById('agenda');

let agenda = JSON.parse(localStorage.getItem('agenda')) || {};
let editando = null; // Guardará qual item está sendo editado

function salvarAgenda() {
  localStorage.setItem('agenda', JSON.stringify(agenda));
}

function renderAgenda() {
  agendaDiv.innerHTML = '';
  const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

  dias.forEach(dia => {
    const servicos = agenda[dia] || [];
    if (servicos.length > 0) {
      const diaDiv = document.createElement('div');
      diaDiv.className = 'dia';
      diaDiv.innerHTML = `<h3>${dia.charAt(0).toUpperCase() + dia.slice(1)}</h3>`;
      servicos.sort((a, b) => a.hora.localeCompare(b.hora));

      servicos.forEach((s, index) => {
        const sDiv = document.createElement('div');
        sDiv.className = 'servico';
        sDiv.innerHTML = `<strong>${s.hora}</strong> - ${s.endereco}<br>
          Cond.: ${s.condominio || '-'}<br>
          Valor: ${s.valor}<br>
          Desc: ${s.descricao}<br>
          Tel: ${s.telefone}<br>
          <button onclick="editarServico('${dia}', ${index})">✏️ Editar</button>
          <button onclick="removerServico('${dia}', ${index})">🗑️ Excluir</button>`;
        diaDiv.appendChild(sDiv);
      });

      agendaDiv.appendChild(diaDiv);
    }
  });
}

function removerServico(dia, index) {
  agenda[dia].splice(index, 1);
  salvarAgenda();
  renderAgenda();
}

function editarServico(dia, index) {
  const s = agenda[dia][index];
  document.getElementById('dia').value = dia;
  document.getElementById('hora').value = s.hora;
  document.getElementById('endereco').value = s.endereco;
  document.getElementById('condominio').value = s.condominio;
  document.getElementById('valor').value = s.valor;
  document.getElementById('descricao').value = s.descricao;
  document.getElementById('telefone').value = s.telefone;
  editando = { dia, index };
}

form.onsubmit = function (e) {
  e.preventDefault();
  const dia = document.getElementById('dia').value;
  const hora = document.getElementById('hora').value;
  const endereco = document.getElementById('endereco').value;
  const condominio = document.getElementById('condominio').value;
  const valor = document.getElementById('valor').value;
  const descricao = document.getElementById('descricao').value;
  const telefone = document.getElementById('telefone').value;

  if (editando) {
    // Atualiza o serviço existente
    agenda[editando.dia][editando.index] = { hora, endereco, condominio, valor, descricao, telefone };
    editando = null;
  } else {
    // Adiciona novo serviço
    if (!agenda[dia]) agenda[dia] = [];
    agenda[dia].push({ hora, endereco, condominio, valor, descricao, telefone });
  }

  salvarAgenda();
  renderAgenda();
  form.reset();
};

renderAgenda();
