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

            // When the select changes value let's update the app
            function selectChange() {
                let selectedOption;
                let len = select.length;
                for (let i = 0; i < len; i++) {
                    selectedOption = select.options[i];
                    if(selectedOption.selected === true) {
                        let id = select.options[select.selectedIndex].value;
                        updateApp(id);
                    }
                }
                return selectedOption;
            }
            document.addEventListener('DOMContentLoaded', selectChange());
            select.addEventListener('change', selectChange);

            // Button next code to cycle through options
            function selectChangeNext() {
                val = select.options.selectedIndex;
                let id;
                if(val === select.length - 1) {
                    id = 0;
                } else {
                    id = val + 1;
                }
                return id;
            }
            document.getElementById('next').addEventListener('click', function () {
                select.options.selectedIndex = selectChangeNext()
                updateApp(selectChangeNext() - 1)
            });

            // Button previous code to cycle through options in reverse
            function selectChangePrev() {
                val = parseInt(select.options[select.selectedIndex].value);
                let id;
                if(val === 0) {
                    id = select.length - 1;
                } else {
                    id = val - 1;
                }
                return id;
            }
            document.getElementById('prev').addEventListener('click', function () {
                select.options.selectedIndex = selectChangePrev()
                updateApp(selectChangePrev() + 1)
            });

            // Update app with data from JSON
            function updateApp(id) {
                document.getElementById('name').innerHTML = data[id].name;
                document.getElementById('bday').innerHTML = data[id].birthday;
                document.getElementById('image').style.backgroundImage = 'url(' + data[id].image_url + ')';
                document.getElementById('quote').innerHTML = data[id].quote;
            }

        } else if (this.status == 404){
            //Error message if request fails
            let error = document.createElement('h1');
            let errorMsg = error.innterHTML = 'Oh snap it be broke.';
            document.getElementById('app').append(error);
        }
    }
    request.send();

});