const jQueryScript = document.createElement('script');
jQueryScript.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
jQueryScript.onload = initApp;
document.head.appendChild(jQueryScript);

const appendLocation = '#ins-api-users';

function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box;
        }
        
        body {
            font-family: sans-serif;
            padding: 10px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        
        h1 {
            margin-bottom: 10px;
            text-align: center;
        }
        
        #ins-api-users {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 10px;
        }
        
        .user-card {
            background: #f5f5f5;
            padding: 10px;
            border: 1px solid #ddd;
        }
        
        .user-info {
            margin-bottom: 5px;
        }
        
        .delete-btn, .reload-btn {
            background: #eee;
            border: 1px solid #ddd;
            padding: 5px 10px;
            cursor: pointer;
            margin-top: 10px;
        }
        
        .reload-btn {
            margin: 10px auto;
            display: block;
        }
    `;
    document.head.appendChild(styleElement);
}

async function fetchUsers() {
    try {
        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (new Date().getTime() < parsedData.expireTime && parsedData.users?.length > 0) {
                return parsedData.users;
            }
        }

        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('HTTP hata: ' + response.status);

        const users = await response.json();
        localStorage.setItem('userData', JSON.stringify({
            users,
            expireTime: new Date().getTime() + 86400000 // 24 saat
        }));
        return users;
    } catch (error) {
        throw new Error('Veriler alınamadı: ' + error.message);
    }
}

function createUserCard(user) {
    const $userCard = $('<div>')
        .attr('data-id', user.id)
        .addClass('user-card')
        .html(`
            <h3>${user.name}</h3>
            <p class="user-info"><strong>Email:</strong> ${user.email}</p>
            <p class="user-info"><strong>Telefon:</strong> ${user.phone}</p>
            <p class="user-info"><strong>Adres:</strong> ${user.address.street}, ${user.address.city}</p>
            <button class="delete-btn">Sil</button>
        `);
    
    $userCard.find('.delete-btn').on('click', () => deleteUser(user.id));
    return $userCard;
}

function deleteUser(userId) {
    $(`[data-id="${userId}"]`).fadeOut('slow', function() {
        $(this).remove();
        checkEmptyUsersAndShowReload();
    });

    const cachedData = JSON.parse(localStorage.getItem('userData')) || { users: [] };
    cachedData.users = cachedData.users.filter(user => user.id !== userId);
    localStorage.setItem('userData', JSON.stringify(cachedData));
}

function setupMutationObserver() {
    let targetNode = document.querySelector(appendLocation);
    if (!targetNode) {
        targetNode = document.createElement('div');
        targetNode.id = appendLocation.replace('#', '');
        document.body.appendChild(targetNode);
    }
    
    new MutationObserver(checkEmptyUsersAndShowReload).observe(targetNode, { 
        childList: true,
        subtree: true
    });
    
    setTimeout(checkEmptyUsersAndShowReload, 1000);
}

function checkEmptyUsersAndShowReload() {
    const targetNode = document.querySelector(appendLocation);
    if (!targetNode) return;
    
    const userCards = targetNode.querySelectorAll('.user-card');
    const hasReloadBtn = document.querySelector('.reload-btn');
    const hasUsedReload = sessionStorage.getItem('reloadButtonUsed') === 'true';
    const hasMessageDisplayed = targetNode.querySelector('.reload-used-message');
    
    if (userCards.length === 0 && !hasReloadBtn && !hasMessageDisplayed) {
        !hasUsedReload ? showReloadButton() : showReloadUsedMessage();
    }
}

function showReloadUsedMessage() {
    $('<p>')
        .addClass('reload-used-message')
        .text('Bu oturumda daha fazla yeniden yükleme yapılamaz.')
        .css({
            'text-align': 'center',
            'margin-top': '20px'
        })
        .appendTo(appendLocation);
}

function showReloadButton() {
    $(appendLocation).find('.reload-used-message, .reload-btn').remove();
    
    $('<button>')
        .addClass('reload-btn')
        .text('Verileri Yeniden Yükle')
        .on('click', function() {
            sessionStorage.setItem('reloadButtonUsed', 'true');
            $(this).remove();
            displayUsers();
        })
        .appendTo(appendLocation);
}

function displayUsers() {
    let $usersContainer = $(appendLocation);
    if (!$usersContainer.length) {
        $usersContainer = $(`<div id="${appendLocation.replace('#', '')}"></div>`).appendTo('body');
    }
    
    $usersContainer.html('<p>Kullanıcılar yükleniyor...</p>');
    
    setTimeout(async function() {
        try {
            const users = await fetchUsers();
            $usersContainer.empty();
            
            if (!users?.length) {
                $usersContainer.html('<p>Hiç kullanıcı bulunamadı!</p>');
                checkEmptyUsersAndShowReload();
                return;
            }
            
            users.forEach((user, i) => {
                createUserCard(user)
                    .hide()
                    .delay(i * 100)
                    .fadeIn()
                    .appendTo($usersContainer);
            });
        } catch (error) {
            $usersContainer.html(`<p style="color:red; text-align:center">HATA: ${error.message}</p>`);
        }
    }, 500);
}

function initApp() {
    addStyles();
    setupMutationObserver();
    displayUsers();
}

if (window.jQuery) initApp();