var acc = document.getElementsByClassName("fields");

for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var menu = this.nextElementSibling;
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
            if (menu.id == "genre-menu") {
            	menu.nextElementSibling.nextElementSibling.style.display = "none";
            } else if (menu.id == "pub-menu") {
            	menu.previousElementSibling.previousElementSibling.style.display = "none";
            }
        }
    });
}

function confirm () {
	var genreConfirmed =[];
	var pubConfirmed = [];
	var displayConfirmed = [];
	for (var i = 0; i < genreFields.length; i++) {
		if (document.getElementById(genreFields[i]).checked) {
			genreConfirmed.push(genreFields[i]);
		}
	}
	for (var i = 0; i < pubFields.length; i++) {
		if (document.getElementById(pubFields[i]).checked) {
			pubConfirmed.push(pubFields[i]);
		}
	}
	for (var i = 0; i < displayFields.length; i++) {
		if (document.getElementById(displayFields[i]).checked) {
			displayConfirmed.push(displayFields[i]);
		}
	}
	if (displayConfirmed.length != 2) {
		alert ("only 2 fields allowed");
		if (displayConfirmed.length == 0) {
			displayConfirmed.push("Sales");
			displayConfirmed.push("Year");
		} else if (displayConfirmed.length == 1) {
			if (displayConfirmed.includes("Sales")) {
				displayConfirmed.push("Year")
			} else if (displayConfirmed.includes("Year")) {
				displayConfirmed.push("Sales");
			} else if (displayConfirmed.includes("User Score")) {
				displayConfirmed.push("Critic Score");
			} else if (displayConfirmed.includes("Critic Score")) {
				displayConfirmed.push("User Score");
			}
		} else if (displayConfirmed.length > 2) {
			while (displayConfirmed.length > 2) {
				displayConfirmed.pop();
			}
		}
	}
	if ((document.getElementById("earlyYear") == null) && (document.getElementById("laterYear") != null)) {
		var yearConfirmed = ["1984", document.getElementById("laterYear").value];
	} else if ((document.getElementById("earlyYear") != null) && (document.getElementById("laterYear") == null)) {
		var yearConfirmed = [document.getElementById("earlyYear").value, "2016"];
	} else if ((document.getElementById("earlyYear") == null) && (document.getElementById("laterYear") == null)) {
		var yearConfirmed = ["1984", "2016"];
	} else {
		var yearConfirmed = [document.getElementById("earlyYear").value, document.getElementById("laterYear").value];
	}
	set (genreConfirmed, pubConfirmed, displayConfirmed, yearConfirmed);
}
