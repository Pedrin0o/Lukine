// auth.js - Verificação segura
if (typeof firebase === 'undefined' || !firebase.apps.length) {
  console.error('Firebase não foi carregado corretamente!');
  throw new Error('Firebase não inicializado');
}

// Verifica se auth e db existem
if (typeof auth === 'undefined' || typeof db === 'undefined') {
  console.error('Serviços do Firebase não inicializados!');
  throw new Error('Auth ou DB não definidos');
}

// Verifica se todos os elementos necessários existem
const requiredIds = [
  'login-form', 'login-email', 'login-password', 'login-btn',
  'register-form', 'register-name', 'register-email', 'register-password', 
  'register-birthdate', 'register-terms', 'register-btn',
  'reset-form', 'reset-email', 'reset-btn',
  'show-register', 'show-login', 'forgot-password', 'back-to-login'
];

requiredIds.forEach(id => {
  if (!document.getElementById(id)) {
    console.error(`Elemento com ID #${id} não encontrado no HTML!`);
  }
});

// Alternar entre Login e Cadastro
document.getElementById('show-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

// Recuperação de Senha
document.getElementById('forgot-password')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('reset-form').style.display = 'block';
});

document.getElementById('back-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('reset-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

// Login com Firebase
document.getElementById('login-btn')?.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Mostra feedback visual durante o login
    const loginBtn = document.getElementById('login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showSuccess('Login realizado com sucesso! Redirecionando...');
            
            // Redireciona para index após 1.5 segundos
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        })
        .catch((error) => {
            showError('Erro ao fazer login: ' + getFirebaseError(error.code));
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalText;
        });
});

// Cadastro com Firebase + Firestore
document.getElementById('register-btn')?.addEventListener('click', () => {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const birthdate = document.getElementById('register-birthdate').value;

    if (!document.getElementById('register-terms').checked) {
        showError('Você deve aceitar os termos de uso');
        return;
    }

    // Mostra feedback visual durante o cadastro
    const registerBtn = document.getElementById('register-btn');
    const originalText = registerBtn.innerHTML;
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            return db.collection('userData').doc(user.uid).set({
                name: name,
                email: email,
                birthdate: birthdate,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            showSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
            
            // Redireciona para login após 2 segundos
            setTimeout(() => {
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
                registerBtn.disabled = false;
                registerBtn.innerHTML = originalText;
            }, 2000);
        })
        .catch((error) => {
            showError('Erro ao cadastrar: ' + getFirebaseError(error.code));
            registerBtn.disabled = false;
            registerBtn.innerHTML = originalText;
        });
});

// Recuperação de Senha
document.getElementById('reset-btn')?.addEventListener('click', () => {
    const email = document.getElementById('reset-email').value;

    auth.sendPasswordResetEmail(email)
        .then(() => {
            showSuccess(`E-mail de recuperação enviado para ${email}`);
            document.getElementById('reset-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        })
        .catch((error) => {
            showError('Erro ao enviar e-mail: ' + getFirebaseError(error.code));
        });
});

// Verifica estado de autenticação e atualiza UI
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('Usuário logado:', user.email);
        updateAuthUI(user);
    } else {
        console.log('Nenhum usuário logado.');
        // Redireciona para login se não estiver em página pública
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('public')) {
            window.location.href = 'login.html';
        }
    }
});

// Funções auxiliares
function updateAuthUI(user) {
    const navIcons = document.querySelector('.nav-icons');
    if (!navIcons) return;

    if (user) {
        // Remove ícone de login se existir
        const loginIcon = document.querySelector('.fa-user');
        if (loginIcon) loginIcon.parentElement.remove();
        
        // Adiciona ícone de logout
        if (!document.getElementById('logout-btn')) {
            navIcons.innerHTML += `
                <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i></a>
            `;
            
            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                auth.signOut().then(() => {
                    window.location.href = 'login.html';
                });
            });
        }
    }
}

function showError(message) {
    const errorElement = document.getElementById('auth-error') || createErrorElement();
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const successElement = document.getElementById('auth-success') || createSuccessElement();
    successElement.textContent = message;
    successElement.style.display = 'block';
    
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 3000);
}

function createErrorElement() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'auth-error';
    errorDiv.style.color = 'red';
    errorDiv.style.margin = '10px 0';
    document.querySelector('.auth-form').prepend(errorDiv);
    return errorDiv;
}

function createSuccessElement() {
    const successDiv = document.createElement('div');
    successDiv.id = 'auth-success';
    successDiv.style.color = '#4CAF50';
    successDiv.style.margin = '10px 0';
    successDiv.style.padding = '10px';
    successDiv.style.backgroundColor = '#f8fff8';
    successDiv.style.border = '1px solid #4CAF50';
    successDiv.style.borderRadius = '4px';
    document.querySelector('.auth-form').prepend(successDiv);
    return successDiv;
}

function getFirebaseError(code) {
    const errors = {
        'auth/email-already-in-use': 'E-mail já cadastrado',
        'auth/invalid-email': 'E-mail inválido',
        'auth/weak-password': 'Senha muito fraca (mínimo 8 caracteres)',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta'
    };
    return errors[code] || code;
}