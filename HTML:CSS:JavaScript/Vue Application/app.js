"use strict"
console.log("app.js")

const url = "https://www.hatchways.io/api/assessment/students"

function load() {

    fetch(url)
      .then(response => {
    	return response.json()
  	})
  	.then(data => {
    	const numberOfStudents = data.students.length
    	let studentFirstNames = []
    	for (let i = 0; i < numberOfStudents; i++) {
    		studentFirstNames.push(data.students[i].firstName)
    	}
    	let studentLastNames = []
    	for (let i = 0; i < numberOfStudents; i++) {
    		studentLastNames.push(data.students[i].lastName)
    	}
    	let emails = []
    	for (let i = 0; i < numberOfStudents; i++) {
    		emails.push(data.students[i].email)
    	}
    	let cities = []
    	for (let i = 0; i < numberOfStudents; i++) {
    		cities.push(data.students[i].city)
    	}
    	let companies = []
    	for (let i = 0; i < numberOfStudents; i++) {
    		companies.push(data.students[i].company)
    	}
    	let listsOfGrades = []
    	for (let i = 0; i < numberOfStudents; i++) {
    		listsOfGrades.push(data.students[i].grades)
    	}
    	let averageGrades = []
    	for (let i = 0; i < numberOfStudents; i++) {
    		let totalOfGrades = 0
    		for (let j = 0; j < data.students[i].grades.length; j++) {
    			totalOfGrades += parseInt(data.students[i].grades[j])
    		}
    		let studentAverage = (totalOfGrades / data.students[i].grades.length)
    		averageGrades.push(studentAverage)
    	}
    	let skills = []
    	for (let i = 0; i < numberOfStudents; i++) {
    		skills.push(data.students[i].skill)
    	}
    	let pictures = []
    	for (let i = 0; i < numberOfStudents; i++) {
    		pictures.push(data.students[i].pic)
    	}

  		
  		const app = new Vue({
			el: '#app',
			data: {
				studentFirstNames: studentFirstNames,
				studentLastNames: studentLastNames,
				emails: emails,
				cities: cities,
				companies: companies,
				listsOfGrades: listsOfGrades,
				averageGrades: averageGrades,
				skills: skills,
				pictures: pictures
			}
		});
  	})
  	.catch(err => {
    	console.log("An error occured with fetch:", err)
  	})
}

function nameSearch() {
	var input, filter, students, student, a, i, txtValue;
    input = document.getElementById("name-input");
    filter = input.value.toUpperCase();
    students = document.getElementById("student-list");
    student = students.getElementsByClassName("student");

    for (i = 0; i < student.length; i++) {
    	a = student[i].getElementsByTagName("h3")[0];
    	txtValue = a.textContent || a.innerText;
    	if (txtValue.toUpperCase().indexOf(filter) > -1) {
    		student[i].style.display = "";
    	} else {
    		student[i].style.display = "none";
    	}
    }
}

function tagSearch() {
	var input, students, student, i, j, grades, tagList, tags, tagNames;
	input = document.getElementById("tag-input").value.toUpperCase();
	students = document.getElementById("student-list");
	student = students.getElementsByClassName("student");
	for (i = 0; i < student.length; i++) {
		tagNames = "";
		grades = student[i].getElementsByClassName("grades")[0];
		tagList = grades.getElementsByClassName("tag-list")[0];
		tags = tagList.getElementsByTagName("li");
		for (j = 0; j < tags.length; j++) {
			tagNames = tagNames.concat(tags[j].innerHTML, ",");
		}
		tagNames = tagNames.toUpperCase();
		if (tagNames.indexOf(input) > -1) {
			student[i].style.display = "";
		} else {
			student[i].style.display = "none";
		}
	}
}

function expand(index) {
	var button = document.getElementsByTagName("button")[index];
	button.classList.toggle("active");
	var gradesList = button.nextElementSibling.nextElementSibling
	.nextElementSibling.nextElementSibling.nextElementSibling
	.nextElementSibling;
	if (gradesList.style.display === "inline-block") {
      gradesList.style.display = "none";
      button.innerText = "+";
    } else {
      gradesList.style.display = "inline-block";
      button.innerText = "-";
    }
    if (gradesList.style.maxHeight) {
      gradesList.style.maxHeight = null;
    } else {
      gradesList.style.maxHeight = gradesList.scrollHeight + "px";
    }
}

function addTag(e, index){
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
    	var student = document.getElementsByClassName("add-tag-input")[index];
    	var tagList = student.previousElementSibling;
    	var input = student.value.trim();
    	if (input.length) {
    		var text = document.createTextNode(input);
    		e.currentTarget.value = "";
    		var li = document.createElement("li");
    		li.appendChild(text);
    		li.classList.add("tag");
    		tagList.appendChild(li);
    	}
    }
}