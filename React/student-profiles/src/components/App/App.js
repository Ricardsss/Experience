import React from 'react';
import './App.css';
import Hatchways from '../../util/Hatchways';
import StudentList from '../StudentList/StudentList';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            students: []
        };
        this.hatchwaysStudents = this.hatchwaysStudents.bind(this);
    }

    hatchwaysStudents() {
        Hatchways.students().then(students => {
            this.setState({
                students: students
            });
        });
    }

    render() {
        this.hatchwaysStudents();
        return (
            <div className="App">
                <StudentList students={this.state.students} />
            </div>
        );
    }
}

export default App;