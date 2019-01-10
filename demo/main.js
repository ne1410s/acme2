((window) => {

    const baseUrl = 'http://localhost:8081';

    const save_token = (token) => sessionStorage.setItem('token', token),
          load_token = () => sessionStorage.getItem('token'),
          wipe_token = () => sessionStorage.removeItem('token');

    const qsa = (q, parent) => Array.from((parent || document).querySelectorAll(q)),
          show_modal = (classname) => qsa('.modal')
            .filter(m => !m.classList.remove('open'))
            .filter(m => m.classList.contains(classname))
            .filter(m => !m.classList.add('open'))[0];

    async function svc(secure, path, method, json) {

        const url = `${baseUrl}/${path}`,
              headers = { 'content-type': 'application/json' },
              body = JSON.stringify(json);

        if (secure === true) {
            headers['authorization'] = `Bearer ${load_token()}`;
        }

        const response = await fetch(url, { method, headers, body }),
              text = await response.text();

        if (response.status === 401 && secure === true) {
            return obtain_login(arguments);
        }
        else if (!response.ok) {
            throw text;
        }

        return JSON.parse(text);
    }

    function obtain_login(args) {
        
        wipe_token();
        const modal = show_modal('login');

        return new Promise((resolve, reject) => {

            modal.querySelector('[type=button]').onclick = () => {

                const passctrl = modal.querySelector('[placeholder=password]'),
                      username = modal.querySelector('[placeholder=username]').value,
                      password = passctrl.value;

                svc(false, 'login', 'POST', { username, password })
                    .then(json => {
                        passctrl.value = '';
                        save_token(json.token);
                        modal.classList.remove('open');
                        return args && args[0] === true ? resolve(svc.apply(null, args)) : null;                   
                    })
                    .catch(err => console.warn(err));
            }
        });
    }

    const list_accounts = () => svc(true, 'account', 'GET').then(accounts => { 
        console.log('accounts', accounts);
    });

    window.addEventListener('load', () => {

        document.querySelector('#logout').onclick = obtain_login;
        document.querySelector('#login').onclick = list_accounts;

        list_accounts();

    });

})(window);