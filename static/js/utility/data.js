
const loadJSON = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const getData = (id, entities) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/get/data',
            method: 'get',
            data: {
                entities: entities,
                id: id
            },
            success: response => {
                const data = response[0];
                resolve(data);
            },
            error: (xhr, status, error) => {
                reject(error);
            }
        });
    });
};
