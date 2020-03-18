const url = "https://www.hatchways.io/api/assessment/students";
const Hatchways = {
    students: () => {
        return fetch(url).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (jsonResponse.students) {
                return jsonResponse.students;
            }
        });
    }
};

export default Hatchways;