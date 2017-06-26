// faz post ajax para registrar nova senha
function SendForm(button) {
  var form = document.querySelector('form[name="manageItem"]');

  if(!form) {
    return false;
  }

  // valida os dados
  if(!form['service.name'].value || !form['service.passwd'].value || !form['user.passwd'].value) {
    alert('Todos os campos são obrigatórios!');
    return false;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', button.getAttribute('data-action'), true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {

      if(xhr.status == 200) {
        form['service.name'].value = '';
        form['service.passwd'].value = '';
        form['user.passwd'].value = '';

        return location.reload();
      }

      alert(xhr.responseText);
      form['user.passwd'].value = '';
    }
  }

  var params = [];
  params.push(`service.name=${encodeURIComponent(form['service.name'].value)}`);
  params.push(`service.passwd=${encodeURIComponent(form['service.passwd'].value)}`);
  params.push(`user.login=${encodeURIComponent(form['user.login'].value)}`);
  params.push(`user.passwd=${encodeURIComponent(form['user.passwd'].value)}`);

  xhr.send(params.join('&'));

  return false;
}

function showServiceData(itemElement) {
  var data = {
    'service.name': itemElement.querySelector('input[name="service.name"]').value,
    'service.passwd': itemElement.querySelector('input[name="service.passwd"]').value
  };

  var form = document.querySelector('form[name="manageItem"]');

  if(!form) {
    return false;
  }

  form['service.name'].value = data['service.name'];
  form['service.passwd'].value = data['service.passwd'];

  document.querySelector('#nav-trigger').checked = false;
}
