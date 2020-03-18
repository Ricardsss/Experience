import React from 'react';
import './StudentList.css';
import Student from '../Student/Student';

class StudentList extends React.Component {
    search() {
        let nameFilter = document.getElementById('name-input').value.toUpperCase();
        let tagFilter = document.getElementById('tag-input').value.toUpperCase();
        let students = document.getElementsByClassName('Student');
        for (let i = 0; i < students.length; i++) {
            let name = students[i].getElementsByClassName('name')[0].innerHTML.toUpperCase();
            let tagNames = "";
            let tagList = students[i].getElementsByClassName('tags')[0];
            let tags = tagList.getElementsByClassName('tag');
            for (let j = 0; j < tags.length; j++) {
                tagNames = tagNames.concat(tags[j].innerHTML, ",");
            }
            tagNames = tagNames.toUpperCase();
            if (name.indexOf(nameFilter) > -1 && tagNames.indexOf(tagFilter) > -1) {
                students[i].style.display = "";
            } else {
                students[i].style.display = "none";
            }
        }
    }

    render() {
        return (
            <div className="StudentList">
                <input id="name-input" className="search" type="text" onKeyUp={this.search} placeholder="Search by name"></input>
                <input id="tag-input" className="search" type="text" onKeyUp={this.search} placeholder="Search by tags"></input>
                {
                    this.props.students.map(student => {
                        return <Student student={student} key={student.id} />
                    })
                }
            </div>
        );
    }
}

export default StudentList;