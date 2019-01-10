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

    const empty = (elem) => { while (elem.firstChild) elem.removeChild(elem.firstChild); },
          remove = (elem) => { if (elem && elem.parentNode) elem.parentNode.removeChild(elem); };


    async function svc(secure, path, method, json) {

        const url = `${baseUrl}/${path}`,
              headers = { 'content-type': 'application/json' },
              body = JSON.stringify(json);

        if (secure === true) {
            headers['authorization'] = `Bearer ${load_token()}`;
        }

        const response = await fetch(url, { method, headers, body }),
              resultjson = await response.json();

        if (response.status === 401 && secure === true) {
            return obtain_login(true)
                .then(() => svc(secure, path, method, json));
        }
        else if (!response.ok) {
            throw resultjson;
        }

        if (secure === true) { 
            console.log('Secure service call was successful:', resultjson);
        }

        return resultjson;
    }

    function obtain_login(fresh) {
        
        return new Promise(resolve => {

            if (fresh === true) wipe_token();
            else if (load_token()) return resolve();

            const modal = show_modal('login');

            modal.querySelector('[type=button]').onclick = () => {

                const passctrl = modal.querySelector('[placeholder=password]'),
                      username = modal.querySelector('[placeholder=username]').value,
                      password = passctrl.value;

                svc(false, 'login', 'POST', { username, password })
                    .then(json => {
                        passctrl.value = '';
                        save_token(json.token);
                        modal.classList.remove('open');
                        return resolve();
                    })
                    .catch(err => console.warn(err));
            }
        });
    }

    function obtain_registration() {

        return new Promise(resolve => {

            const modal = show_modal('register');

            modal.querySelector('[type=button]').onclick = () => {

                const passctrl = modal.querySelector('[placeholder=password]'),
                      username = modal.querySelector('[placeholder=username]').value,
                      password = passctrl.value;

                svc(false, 'user', 'POST', { username, password })
                    .then(json => {
                        passctrl.value = '';
                        save_token(json.token);
                        modal.classList.remove('open');
                        return resolve();
                    })
                    .catch(err => console.warn(err));
            }
        });
    }

    const list_accounts = () => svc(true, 'account', 'GET').then(accounts => { 
        const target = qsa('#accounts > .list')[0];
        empty(target);
        accounts.forEach(acc => {
            const elem = document.createElement('div');
            elem.innerHTML = acc.accountId;
            target.appendChild(elem);
        });
    });

    const logout = () => {
        wipe_token();
        qsa('.list').forEach(l => empty(l));
        obtain_login().then(list_accounts);
    }

    window.addEventListener('load', () => {

        document.querySelector('#logout').onclick = logout;
        document.querySelector('#login').onclick = () => obtain_login().then(list_accounts);
        document.querySelector('#register').onclick = () => obtain_registration().then(list_accounts);

        obtain_login().then(list_accounts);
    });

})(window);