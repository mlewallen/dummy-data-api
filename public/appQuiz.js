document.addEventListener('DOMContentLoaded', function() {

    //Global constants
    const select = document.getElementById('pickPerson');

    //JSON Request
    let request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:3000/data', true);

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            // Parse out the reponse
            let data = JSON.parse(this.responseText);

            // Let's add the data we parsed out to the #pickPerson select dynamically
            data.forEach(function(i){
                let option = document.createElement('OPTION');
                option.setAttribute('value', i.id - 1);
                let name = document.createTextNode(i.name);
                option.appendChild(name);
                select.appendChild(option);
            });

        } else if (this.status == 404){
            //Error message if request fails
            let error = document.createElement('h1');
            let errorMsg = error.innterHTML = 'Oh snap it be broke.';
            document.getElementById('app').append(error);
        }
    }
    request.send();

});