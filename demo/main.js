((window) => {

    const baseUrl = 'http://localhost:8081';

    const call = (relPath, verb, json) => fetch({
        url: `${baseUrl}/${relPath}`,
        method: verb,
        body: JSON.stringify(json)
    });

    const loadToken = () => localStorage.getItem('token');
    const saveToken = (token) => localStorage.setItem('token', token);
    const wipeToken = () => localStorage.removeItem('token');

    window.addEventListener('load', () => {
        document.querySelector
    });

    function call_login(username, password) {
        call('login', 'post', { username, password })
            .then((response) => saveToken(response.text()))
            .then(() => console.log('ok'))
            .catch(err => console.error(err));
    }



})(window);