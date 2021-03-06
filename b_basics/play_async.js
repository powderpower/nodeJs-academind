const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done');
        }, 1500);
    });
};

setTimeout(() => {
    console.log('Timer is done');

    /*
    fetchData(text => {
        console.log(text);
    });
    */
   
    fetchData()
        .then(text => {
            console.log(text);

            return fetchData();
        })
        .then(text2 => {
            console.log(text2);

            return fetchData();
        });

}, 2e3);

console.log('Hello');