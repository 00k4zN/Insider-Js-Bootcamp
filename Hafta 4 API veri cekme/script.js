function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        * { margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body {
            font-family: sans-serif;
            padding: 15px;
            background-color: #f8f8f8;
            color: #333;
            line-height: 1.4;
        }

        .container { max-width: 1000px; margin: 0 auto; }

        h1 {
            margin-bottom: 15px;
            text-align: center;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
        }
        
        #ins-api-users {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        }

        .user-card {
            background: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }

        .user-card h3 { margin-bottom: 10px; }
        .user-info { margin-bottom: 5px; color: #555; font-size: 0.9rem; }
        
        .delete-btn {
            background: #f1f1f1;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 10px;
        }

        .delete-btn:hover { background: #e74c3c; color: white; }
    `;

    document.head.appendChild(styleElement);
}

async function fetchUsers() {
    try {
        const cachedData = localStorage.getItem('userData');
        const cachedTime = localStorage.getItem('userDataTimestamp');

        if (cachedData && cachedTime) {
            const now = new Date().getTime();
            const cacheAge = now - parseInt(cachedTime);
            const parsedData = JSON.parse(cachedData);
            
            if (cacheAge < 24 * 60 * 60 * 1000 && parsedData.length > 0) {
                return parsedData;
            }
        }

        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        if (!response.ok) {
            throw new Error('Erişilemedi! HTTP hata kodu: ' + response.status);
        }

        const data = await response.json();

        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('userDataTimestamp', new Date().getTime().toString());

        return data;
    } catch (error) {
        throw new Error('Veriler alınamadı: ' + error.message);
    }
}

function createUserCard(user) {
    let $userCard = $('<div>');
    $userCard.attr('data-id', user.id);
    $userCard.addClass('user-card');
    
    let cardHTML = `
        <h3>${user.name}</h3>
        <p class="user-info"><strong>Email:</strong> ${user.email}</p>
        <p class="user-info"><strong>Telefon:</strong> ${user.phone}</p>
        <p class="user-info"><strong>Adres:</strong> ${user.address.street}, ${user.address.city}</p>
        <button class="delete-btn">Sil</button>
    `;
    
    $userCard.html(cardHTML);
    
    $userCard.find('.delete-btn').on('click', function() {
        deleteUser(user.id);
    });
    
    return $userCard;
}

function deleteUser(userId) {
    $('[data-id="' + userId + '"]').fadeOut('slow', function() {
        $(this).remove();
    });

    var cachedData = JSON.parse(localStorage.getItem('userData')) || [];
    var updatedData = [];
    
    for (var i = 0; i < cachedData.length; i++) {
        if (cachedData[i].id !== userId) {
            updatedData.push(cachedData[i]);
        }
    }
    
    localStorage.setItem('userData', JSON.stringify(updatedData));
    
    if (updatedData.length === 0) {
        localStorage.removeItem('userDataTimestamp');
        $('#ins-api-users').append('<p>Tüm kullanıcılar silindi!</p>');
    }
}

function displayUsers() {
    var $usersContainer = $('#ins-api-users');
    $usersContainer.empty().html('<p>Kullanıcılar yükleniyor...</p>');
    
    setTimeout(async function() {
        try {
            const users = await fetchUsers();
            $usersContainer.empty();
            
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let $card = createUserCard(user);
                $usersContainer.append($card);
                
                $card.hide().delay(i * 100).fadeIn();
            }
        } catch (error) {
            $usersContainer.html(`<p style="color: red; text-align: center;">HATA: ${error.message}</p>`);
        }
    }, 500);
}

$(function() {
    addStyles();
    displayUsers();
});