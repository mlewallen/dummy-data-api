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
            option.setAttribute('value', i.id);
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
                    updateApp(i);
                }
            }
            return selectedOption;
        }
        document.addEventListener('DOMContentLoaded', selectChange());
        select.addEventListener('change', selectChange);

        // Button next code to cycle through options
        function selectChangeNext(val) {
            if(val === select.length) {
                return 0;
            } else {
                return val++;
            }
        }
        document.getElementById('next').addEventListener('click', function () {
            let val = parseInt(select.options[select.selectedIndex].value);
            select.options.selectedIndex = selectChangeNext(val);
            updateApp(selectChangeNext(val));

        });

        // Button previous code to cycle through options in reverse
        function selectChangePrev(val) {
            if(val === 1) {
                return select.length - 1;
            } else {
                return val - 2;
            }
        }
        document.getElementById('prev').addEventListener('click', function () {
            let val = parseInt(select.options[select.selectedIndex].value);
            select.options.selectedIndex = selectChangePrev(val);
            updateApp(selectChangePrev(val));
        });

        //add arrow key functionality
        document.onkeydown = function(e) {
          let val = parseInt(select.options[select.selectedIndex].value);
          if (e.keyCode === 39) {
            select.options.selectedIndex = selectChangeNext(val);
            updateApp(selectChangeNext(val));
          } else if (e.keyCode === 37) {
              select.options.selectedIndex = selectChangePrev(val);
              updateApp(selectChangePrev(val));
            }
        }

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