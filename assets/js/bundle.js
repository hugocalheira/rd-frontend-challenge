"use strict";
(() => {
    const TOKEN = "token";

    const selector = selector => {
        return document.querySelector(selector);
    };
    const create = element => {
        return document.createElement(element);
    };

    const app = selector('#app');

    const Login = create('div');

    Login.classList.add('login');

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');

    const Form = create('form');

    Form.onsubmit = async e => {
        e.preventDefault();

        const [email, password] = e.target.children;

        const { url } = await fakeAuthenticate(email.value, password.value);

        location.href = '#users';

        const users = await getDevelopersList(url);
        renderPageUsers(users);
    };

    Form.oninput = e => {
        const [email, password, button] = e.target.parentElement.children;
        (!email.validity.valid || !email.value || password.value.length <= 5)
            ? button.setAttribute('disabled', 'disabled')
            : button.removeAttribute('disabled');
    };

    Form.innerHTML = `
        <input class="" type="text" name="email" placeholder="Entre com seu email" autofocus/>
        <input class="" type="password" name="password" placeholder="Sua senha supersecreta"/>
        <button>Entrar</button>
    `;

    app.appendChild(Logo);
    Login.appendChild(Form);

    async function fakeAuthenticate(email, password) {

        return await fetch('http://www.mocky.io/v2/5dba690e3000008c00028eb6').then(response => {
            return response.json().then(data => {
                const fakeJwtToken = `${btoa(email + password)}.${btoa(data.url)}.${(new Date()).getTime() + 300000}`;
                localStorage.setItem(TOKEN, fakeJwtToken)
                return data;
            });
        });

    }

    async function getDevelopersList(url) {
        /**
         * bloco de código omitido
         * aqui esperamos que você faça a segunda requisição 
         * para carregar a lista de desenvolvedores
         */

        return await fetch(url).then(response => {
            return response.json().then(data => {
                return data;
            });
        });
    }

    function renderPageUsers(users) {
        app.classList.add('logged');
        Login.style.display = false;

        const Ul = create('ul');
        Ul.classList.add('container')

        users.map(item => {
            console.log(item);
            const LI = create('li');
            LI.innerHTML = `
            <img src="${item.avatar_url}"/>
            <span>${item.login}</span>
            `
            Ul.appendChild(LI);
        });


        app.appendChild(Ul)
    }

    // init
    (async function () {
        const rawToken = localStorage.getItem(TOKEN) || undefined;
        const token = rawToken ? rawToken.split('.') : null
        // console.log(token[2], (new Date()).getTime());
        if (!token || token[2] < (new Date()).getTime()) {
            localStorage.removeItem(TOKEN);
            location.href = '#login';
            app.appendChild(Login);
        } else {
            location.href = '#users';
            const users = await getDevelopersList(atob(token[1]));
            renderPageUsers(users);
        }
    })()
})()