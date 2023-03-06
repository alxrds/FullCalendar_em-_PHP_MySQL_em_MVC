var myModal = new bootstrap.Modal(document.getElementById('myModal'));
let frm = document.getElementById('formulario');
let deletar = document.getElementById('btnDelete');
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev, next, today',
      center: 'title',
      right: 'dayGridMonth, timeGridWeek, listWeek'
    },
    events: '/calendar/list/',
    editable: true,
    dateClick: function(info){
      frm.reset();
      document.getElementById('id').value = '';
      deletar.classList.add('d-none');
      document.getElementById('start').value = info.dateStr;
      document.getElementById('titulo').textContent = "Registrar Evento";
      document.getElementById('btnAction').textContent = "Registrar";
      myModal.show();
    },
    eventClick: function(info){
      document.getElementById('titulo').textContent = "Modificar Evento";
      document.getElementById('btnAction').textContent = "Modificar";
      deletar.classList.remove('d-none');
      document.getElementById('id').value = info.event.id;
      document.getElementById('title').value = info.event.title;
      document.getElementById('start').value = info.event.startStr;
      document.getElementById('color').value = info.event.backgroundColor;
      myModal.show();
    },
    eventDrop: function(info){
      const id = info.event.id;
      const fecha = info.event.startStr;
      const url = '/calendar/drop/' + id;
      const http = new XMLHttpRequest();
      const data = new FormData();
      data.append('id', id);
      data.append('start', fecha);
      http.open('POST', url, true);
      http.send(data);
      http.onreadystatechange = function(){
        console.log(this.responseText);
        if(this.readyState == 4 && this.status == 200){
          if(this.responseText == 4){
            calendar.refetchEvents()
            myModal.hide();
            frm.reset();
            Swal.fire (
              'Aviso',
              'Evento Alterado com Sucesso',
              'success'
            );
          }
        }
      }
    }
  });
  calendar.render();
  frm.addEventListener('submit', function(e){
    e.preventDefault();
    const title = document.getElementById('title').value;
    const fecha = document.getElementById('start').value;
    const color = document.getElementById('color').value;
    if(title == '' || fecha == '' || color == ''){
      Swal.fire (
        'Aviso',
        'Todos os campos são obrigatórios',
        'warning'
      )
    }else{
      const url = '/calendar/new/';
      const http = new XMLHttpRequest();
      http.open('POST', url, true);
      http.send(new FormData(frm));
      http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
          if(this.responseText == 1){
            calendar.refetchEvents()
            myModal.hide();
            frm.reset();
            Swal.fire (
              'Aviso',
              'Evento Cadastrado com Sucesso',
              'success'
            );
          }
          if(this.responseText == 2){
            calendar.refetchEvents()
            myModal.hide();
            frm.reset();
            Swal.fire (
              'Aviso',
              'Evento Modificado com Sucesso',
              'success'
            );
          }
        }
      }
    }
  });
  deletar.addEventListener('click', function(){
    Swal.fire({
      title: 'Aviso',
      text: "Essa ação não podera ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        myModal.hide();
        const id = document.getElementById('id').value;
        const url = '/calendar/remove/' + id;
        const http = new XMLHttpRequest();
        http.open('GET', url, true);
        http.send(new FormData(frm));
        http.onreadystatechange = function(){
          if(this.readyState == 4 && this.status == 200){
            if(this.responseText == 3){
              calendar.refetchEvents()
              myModal.hide();
              frm.reset();
              Swal.fire (
                'Aviso',
                'Evento Excluído com Sucesso',
                'success'
              );
            }
          }
        }
      }
    })
  });
});

