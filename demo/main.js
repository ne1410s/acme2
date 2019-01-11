((window) => {

    const baseUrl = 'http://localhost:8081';

    const save_token = (token) => sessionStorage.setItem('token', token),
          load_token = () => sessionStorage.getItem('token'),
          wipe_token = () => sessionStorage.removeItem('token');

    const q2a = (q, parent) => Array.from((parent || document).querySelectorAll(q)),
          q2f = (q, parent) => (parent || document).querySelector(q),
          show_modal = (classname) => q2a('.modal')
            .filter(m => !m.classList.remove('open'))
            .filter(m => m.classList.contains(classname))
            .filter(m => !m.classList.add('open'))
            .filter(m => !q2f('textarea, input', m).focus())[0];

    const empty = (elem) => { while (elem.firstChild) elem.removeChild(elem.firstChild); },
          remove = (elem) => { if (elem && elem.parentNode) elem.parentNode.removeChild(elem); },
          clear = (modal) => { 
              q2a('input:not([type=button]), select, textarea', modal).forEach(ctrl => ctrl.value = '');
              q2a('checkbox, radio', modal).forEach(ctrl => ctrl.checked = false);
          };


    async function svc(secure, path, method, json) {

        const url = `${baseUrl}/${path}`,
              headers = { 'content-type': 'application/json' },
              body = JSON.stringify(json);

        if (secure === true) {
            headers['authorization'] = `Bearer ${load_token()}`;
        }

        const loaders = q2a('[data-loader=' + path + ']');
        loaders.forEach(l => l.classList.add('loading'))

        const response = await fetch(url, { method, headers, body }),
              resultjson = await response.json();

        loaders.forEach(l => l.classList.remove('loading'))

        if (response.status === 401 && secure === true) {
            q2f('body').classList.remove('auth');
            return obtain_login(true)
                .then(() => svc(secure, path, method, json));
        }
        else if (!response.ok) {
            throw resultjson;
        }

        if (secure === true) {
            q2f('body').classList.add('auth');
            console.log('Secure service call was successful:', resultjson);
        }

        return resultjson;
    }

    function obtain_login(fresh) {
        
        return new Promise(resolve => {

            if (fresh === true) wipe_token();
            else if (load_token()) {

                // assume auth granted
                q2f('body').classList.add('auth');
                return resolve();
            }

            const modal = show_modal('login');

            q2f('[type=button]', modal).onclick = () => {

                const password = q2f('[placeholder=password]', modal).value,
                      username = q2f('[placeholder=username]', modal).value;

                svc(false, 'login', 'POST', { username, password })
                    .then(json => {
                        save_token(json.token);
                        
                        modal.classList.remove('open');
                        q2f('body').classList.add('auth');
                        clear(modal);

                        return resolve();
                    })
                    .catch(err => console.warn(err));
            }
        });
    }

    function obtain_registration() {

        return new Promise(resolve => {

            const modal = show_modal('register');

            q2f('[type=button]', modal).onclick = () => {

                const password = q2f('[placeholder=password]', modal).value,
                      username = q2f('[placeholder=username]', modal).value;

                svc(false, 'user', 'POST', { username, password })
                    .then(json => {     
                        save_token(json.token);

                        modal.classList.remove('open');
                        q2f('body').classList.add('auth');
                        clear(modal);

                        return resolve();
                    })
                    .catch(err => console.warn(err));
            }
        });
    }

    function obtain_add_account() {

        return new Promise(resolve => {

            const modal = show_modal('add-account');

            q2f('[type=button]', modal).onclick = () => {

                const tosAgreed = q2f('#agree-tos', modal).checked,
                      emails = q2f('[placeholder=emails]', modal).value
                        .split(/[\s,;]/g)
                        .filter(a => a.length !== 0);
                        
                svc(true, 'account', 'POST', { emails, tosAgreed })
                    .then(json => {
                        modal.classList.remove('open');
                        clear(modal);
                        return resolve();
                    })
                    .catch(err => console.warn(err));
            }
        });
    }

    const list_accounts = () => svc(true, 'account', 'GET').then(accounts => { 
        const target = q2a('#accounts > .list')[0];
        empty(target);
        accounts.forEach(acc => {
            const elem_account = document.createElement('div'),
                  elem_emails = document.createElement('span');
                  
            elem_account.setAttribute('data-id', acc.accountId);
            elem_account.setAttribute('data-status', acc.status);
            elem_emails.textContent = acc.emails.join('; ');

            elem_account.appendChild(elem_emails);
            target.appendChild(elem_account);
        });
    });

    const show_login = () => obtain_login().then(list_accounts),
          show_register = () => obtain_registration().then(list_accounts),
          show_add_account = () => obtain_add_account().then(list_accounts);

    const logout = () => {
        wipe_token();
        q2a('.list').forEach(l => empty(l));
        q2f('body').classList.remove('auth');
        show_login();
    }

    window.addEventListener('load', () => {

        q2a('.secure > .modal').forEach(m => 
            m.onclick = (event) => event.target.classList.remove('open'));
        q2a('.secure > .modal > .body').forEach(m =>
            m.onclick = (event) => event.stopPropagation());

        q2f('#logout').onclick = logout;
        q2f('#login').onclick = show_login;
        q2f('#register').onclick = show_register;
        q2f('#add-account').onclick = show_add_account;

        show_login();
    });

})(window);