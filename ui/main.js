((window) => {

    const baseUrl = 'http://localhost:8081',
          recaptchaKey = '6LchaokUAAAAAMValneQDxXiiirpT-BSC4R7uWfy';

    const save_token = (token) => sessionStorage.setItem('token', token),
          load_token = () => sessionStorage.getItem('token'),
          wipe_token = () => sessionStorage.removeItem('token');

    const empty = (elem) => { while (elem.firstChild) elem.removeChild(elem.firstChild); },
          remove = (elem) => { if (elem && elem.parentNode) elem.parentNode.removeChild(elem); },
          q2a = (q, parent) => Array.from((parent || document).querySelectorAll(q)),
          q2f = (q, parent) => (parent || document).querySelector(q),
          show_modal = (classname) => q2a('.modal')
            .filter(m => {
                if (m.parentElement instanceof HTMLBodyElement) m.classList.remove('open');
                return true;
            })
            .filter(m => m.classList.contains(classname))
            .filter(m => {
                empty(q2f('.errors', m));
                m.classList.add('open');
                return !q2f('textarea, input', m).focus();
            })[0];

    const clear = (modal) => { 
        q2a('input:not([type=button]), select, textarea', modal).forEach(ctrl => ctrl.value = '');
        q2a('[type=checkbox], [type=radio]', modal).forEach(ctrl => ctrl.checked = false);
        empty(q2f('.errors', modal));
    };

    const set_enabled = (modal, enable) => {

        q2a('input, select, textarea', modal).forEach(ctrl => {
            if (enable === true) { 
                ctrl.classList.remove('disabled');
                ctrl.removeAttribute('disabled');
            } else {
                ctrl.classList.add('disabled');
                ctrl.setAttribute('disabled', '');
            }
        });  
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

            const modal = show_modal('login'),
                  errors = q2f('.errors', modal);

            q2f('[type=button]', modal).onclick = () => {

                empty(errors);
                set_enabled(modal, false);

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
                    .catch(err => {
                        console.warn(err);
                        errors.innerHTML = err.detail
                            ? err.detail.join('<br>')
                            : err.message || err;
                    })
                    .finally(() => set_enabled(modal, true));
            }
        });
    }

    function obtain_registration() {

        return new Promise(resolve => {

            const modal = show_modal('register'),
                  errors = q2f('.errors', modal);

            q2f('[type=button]', modal).onclick = () => {

                empty(errors);
                set_enabled(modal, false);

                const password = q2f('[placeholder=password]', modal).value,
                      username = q2f('[placeholder=username]', modal).value;

                if (!window.grecaptcha) {
                    errors.textContent = 'Registration error. Blame google :P';
                    return set_enabled(modal, true);
                }

                // obtain recaptcha token for server-side verification
                grecaptcha.execute(recaptchaKey, {action: 'register'})
                    .then(recaptcha => svc(false, 'user', 'POST', { username, password, recaptcha })
                        .then(json => {     
                            save_token(json.token);
                            modal.classList.remove('open');
                            q2f('body').classList.add('auth');
                            clear(modal);
                            return resolve();
                        })
                        .catch(err => {
                            console.warn(err);
                            errors.innerHTML = err.detail
                                ? err.detail.join('<br>')
                                : err.message || err;
                        })
                        .finally(() => set_enabled(modal, true))
                    );
            }
        });
    }

    function obtain_add_account() {

        return new Promise(resolve => {

            const modal = show_modal('add-account'),
                  errors = q2f('.errors', modal);

            q2f('[type=button]', modal).onclick = () => {

                empty(errors);
                set_enabled(modal, false);

                const tosAgreed = q2f('#agree-tos', modal).checked,
                      isTest = q2f('#test-mode', modal).checked,
                      emails = q2f('[placeholder=emails]', modal).value
                        .split(/[\s,;]/g)
                        .filter(a => a.length !== 0);
                        
                svc(true, 'account', 'POST', { emails, tosAgreed, isTest })
                    .then(json => {
                        modal.classList.remove('open');
                        clear(modal);
                        return resolve();
                    })
                    .catch(err => {
                        console.warn(err);
                        errors.innerHTML = err.detail
                            ? err.detail.join('<br>')
                            : err.message || err;
                    })
                    .finally(() => set_enabled(modal, true));
            }
        });
    }

    function obtain_add_order(accountId) {

        return new Promise(resolve => {

            const modal = show_modal('add-order'),
                  errors = q2f('.errors', modal);

            q2f('[type=button]', modal).onclick = () => {

                empty(errors);
                set_enabled(modal, false);

                const domains = q2f('[placeholder=domains]', modal).value
                        .split(/[\s,;]/g)
                        .filter(a => a.length !== 0);
                        
                svc(true, 'order', 'POST', { accountId, domains })
                    .then(json => {
                        modal.classList.remove('open');
                        clear(modal);
                        return resolve();
                    })
                    .catch(err => {
                        console.warn(err);
                        errors.innerHTML = err.detail
                            ? err.detail.map(d => d.message || d).join('<br>')
                            : err.message || err;
                    })
                    .finally(() => set_enabled(modal, true));
            }
        });
    }

    const list_accounts = () => svc(true, 'account', 'GET').then(accounts => { 
        const targetZone = q2f('.accounts.zone');
        empty(targetZone);
        accounts.forEach(acc => {

            const elem_account = document.createElement('article'),
                  elem_accountTitle = document.createElement('h1'),
                  elem_emails = document.createElement('section'),
                  elem_orders = document.createElement('section'),
                  elem_addOrder = document.createElement('a');

            let iterelem_email,
                iterelem_order,
                iterelem_orderTitle,
                iterelem_domains,
                iterelem_domain;

            elem_account.setAttribute('data-id', acc.accountId);
            elem_accountTitle.textContent = acc.accountId;
            elem_account.setAttribute('data-status', acc.status);
            elem_account.setAttribute('data-env', acc.isTest ? 'test' : 'live');

            elem_orders.classList.add('orders', 'zone');
            elem_addOrder.classList.add('add-order');
            elem_addOrder.setAttribute('href', 'javascript:void(0)');
            elem_addOrder.textContent = '+';
            elem_addOrder.onclick = () => show_add_order(acc.accountId);
                        
            acc.emails.forEach(email => {
                iterelem_email = document.createElement('span');
                iterelem_email.textContent = email;
                elem_emails.appendChild(iterelem_email);
            });

            acc.orders.forEach(order => {

                iterelem_order = document.createElement('article');
                iterelem_orderTitle = document.createElement('h1');
                iterelem_domains = document.createElement('section');

                iterelem_order.setAttribute('data-id', order.orderId);
                iterelem_orderTitle.textContent = order.orderId;
                iterelem_order.appendChild(iterelem_orderTitle);
                iterelem_order.appendChild(iterelem_domains);
                elem_orders.appendChild(iterelem_order);

                order.domains.forEach(domain => {
                    iterelem_domain = document.createElement('span');
                    iterelem_domain.textContent = domain;
                    iterelem_domains.appendChild(iterelem_domain);
                });
            });

            if (acc.orders.length === 0) {
                const elem_ordersEmpty = document.createElement('p');
                elem_ordersEmpty.textContent = 'No orders found';
                elem_orders.appendChild(elem_ordersEmpty);
            }

            elem_account.appendChild(elem_accountTitle);
            elem_account.appendChild(elem_emails);
            elem_orders.appendChild(elem_addOrder);
            elem_account.appendChild(elem_orders);
            targetZone.appendChild(elem_account);
        });

        if (accounts.length === 0) {
            const elem_accountsEmpty = document.createElement('p');
            elem_accountsEmpty.textContent = 'No accounts found';
            targetZone.appendChild(elem_accountsEmpty);
        }

        const elem_addAccount = document.createElement('a');
        elem_addAccount.setAttribute('id', 'add-account');
        elem_addAccount.setAttribute('href', 'javascript:void(0)');
        elem_addAccount.textContent = '+';
        elem_addAccount.onclick = show_add_account;
        targetZone.appendChild(elem_addAccount);
    });

    const show_login = () => obtain_login().then(list_accounts),
          show_register = () => obtain_registration().then(list_accounts),
          show_add_account = () => obtain_add_account().then(list_accounts),
          show_add_order = (accId) => obtain_add_order(accId).then(list_accounts);

    const logout = () => {
        wipe_token();
        empty(q2f('.accounts.zone'));
        q2f('body').classList.remove('auth');
        show_login();
    }

    window.addEventListener('load', () => {

        // return key submits modals
        q2a('.modal [type=button]').forEach(ctrl => {
            ctrl.closest('.modal').addEventListener('keypress', (event) => {
                if (event.target.type !== 'textarea' && event.keyCode === 13) {
                    ctrl.click();
                }
            });
        });

        // close secure modals on background click
        q2a('.secure > .modal').forEach(m =>
            m.onclick = () => {
                empty(q2f('.errors', m));
                m.classList.remove('open');
            });
        // prevent secure modal body clicks from propagating
        q2a('.secure > .modal > .body').forEach(m =>
            m.onclick = (event) => event.stopPropagation());

        q2f('#logout').onclick = logout;
        q2f('#login').onclick = show_login;
        q2f('#register').onclick = show_register;

        show_login();
    });

})(window);