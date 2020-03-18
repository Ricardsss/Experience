import React from 'react';
import './Student.css';

class Student extends React.Component {
    expand(event) {
        let button = event.target;
        let gradesList = button.parentElement.getElementsByClassName('grades')[0];
        let tagsInput = button.parentElement.getElementsByClassName('add-tag-input')[0];
        let tagsList = button.parentElement.getElementsByClassName('tags')[0];
        if (gradesList.style.display === "inline-block" && tagsInput.style.display === "inline-block" && tagsList.style.display === "inline-block") {
            gradesList.style.display = "none";
            tagsInput.style.display = "none";
            tagsList.style.display = "none";
            button.innerText = "+";
        } else {
            gradesList.style.display = "inline-block";
            tagsInput.style.display = "inline-block";
            tagsList.style.display = "inline-block";
            button.innerText = "-";
        }
    }

    addTag(event) {
        let keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode === 13) {
            let input = event.target.value.trim();
            let student = event.target.parentElement;
            let tagList = student.getElementsByClassName('tags')[0];
            let tags = tagList.getElementsByClassName('tag');
            if (input) {
                if (tags[0]) {
                    for (let i = 0; i < tags.length; i++) {
                        if (tags[i].innerText === input) {
                            return;
                        }
                    }
                }
                let text = document.createTextNode(input);
                event.target.value = "";
                let li = document.createElement('li');
                li.appendChild(text);
                li.classList.add('tag');
                tagList.appendChild(li);
            }
        }
    }

    render() {
        return (
            <div className="Student">
                <div className="imageContainer">
                    <img className="image" src={this.props.student.pic} />
                </div>
                <button className="expand-btn" onClick={this.expand}>+</button>
                <p className="name">{this.props.student.firstName} {this.props.student.lastName}</p>
                <p className="information">Email: {this.props.student.email}</p>
                <p className="information">Company: {this.props.student.company}</p>
                <p className="information">Skill: {this.props.student.skill}</p>
                <p className="average information">Average: {this.props.student.grades.reduce((total, num) => {
                    return parseInt(total) + parseInt(num);
                }) / this.props.student.grades.length}%</p>
                <ul className="grades information">
                    {
                        this.props.student.grades.map((grade, index) => {

                            return <li>Test {index + 1}:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{grade}%</li>
                        })
                    }
                </ul>
                <ul className="tags information">
                </ul>
                <input className="add-tag-input" type="text" placeholder="Add a tag" onKeyPress={this.addTag}></input>
            </div>
        );
    }
}

export default Student;