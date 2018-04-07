var acc = document.getElementsByClassName("fields");

for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var menu = this.nextElementSibling;
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
        }
    });
}

function setGenreTrue (param) {
    var checkBox = document.getElementById(param);
    var text = document.getElementById("text");
    if (checkBox.checked == true){
        text.style.display = "block";
    } else {
       text.style.display = "none";
    }
}

function setPubTrue (param) {
    var checkBox = document.getElementById(param);
    var text = document.getElementById("text2");
    if (checkBox.checked == true){
        text.style.display = "block";
    } else {
       text.style.display = "none";
    }
}

function setFilters () {
	var year = document.getElementById("Year");
	var timeFilter = document.getElementById("timeFilter");
	if (year.checked == true) {
		timeFilter.style.display = "block";
	} else {
		timeFilter.style.display = "none";
	}
}