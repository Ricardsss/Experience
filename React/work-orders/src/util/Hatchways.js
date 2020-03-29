const Hatchways = {
    workOrders: async () => {
        const response = await fetch("https://www.hatchways.io/api/assessment/work_orders");
        const jsonResponse = await response.json();
        if (jsonResponse.orders) {
            return jsonResponse.orders;
        }
    },

    worker: async (id) => {
        const response = await fetch(`https://www.hatchways.io/api/assessment/workers/${id}`);
        const jsonResponse = await response.json();
        if (jsonResponse.worker) {
            return jsonResponse.worker;
        }
    },

    workers: async () => {
        const workers = [];
        for (let id = 0; id < 5; id++) {
            let worker = await Hatchways.worker(id);
            workers.push(worker);
        }
        return workers;
    }
};

export default Hatchways;