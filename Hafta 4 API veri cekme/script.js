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

//API ile kullanıcıları çekme

async function fetchUsers() {
    //hata yönetimi için try-catch bloğu: hata olursa catch bloğu çalışıyor
    try {
        //localStorage'da daha önce kaydedilmiş veri var mı diye kontrol et
        const cachedData = localStorage.getItem('userData');
        const cachedTime = localStorage.getItem('userDataTimestamp');

        //localStorage'da veri var
        if (cachedData && cachedTime) {
            //şu anki zaman ms cinsinden
            const now = new Date().getTime();

            //cache yaşı hesaplamamız gerek
            const cacheAge = now - parseInt(cachedTime);
            const parsedData = JSON.parse(cachedData);
            
            //24 saatten yeni ve içerisinde veri varsa
            if (cacheAge < 24 * 60 * 60 * 1000 && parsedData.length > 0) {
                return parsedData;
            }
        }

        //localStorage'da veri yok ya da 24 saatten eskiyse fetchle API'den veriyi alıyoruz
        const response = await fetch('https://jsonplaceholder.typicode.com/users'); //fetch promise döndürüyor o yüzden de await kullanıyoruz

        //hata için response.ok değeri false ise hata var demek
        if (!response.ok) {
            throw new Error('Bir hata oluştu! Veri Çekilemedi!');
        }

        //response.json() ile gelen veriyi javaScript objesine çevirmemiz gerek
        const data = await response.json(); //yine promise döndürdüğü için await kullanıyoruz

        //localStorage'a veriyi kaydı
        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('userDataTimestamp', new Date().getTime().toString()); //şu anki zamanı ms cinsinden stringe çevirip kaydettik

        return data;
    } catch (error) {
        throw new Error('Kullanıcı Verileri Alınamadı' + error.message);
    }
}


//Kullanıcı Kartlarını oluşturma
function createUserCard(user) {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';
    userCard.setAttribute('data-id', user.id);
    

    userCard.innerHTML = `
        <h3>${user.name}</h3>
        <p class="user-info"><strong>Email:</strong> ${user.email}</p>
        <p class="user-info"><strong>Telefon:</strong> ${user.phone}</p>
        <p class="user-info"><strong>Adres:</strong> ${user.address.street}, ${user.address.city}</p>
        <button class="delete-btn" onclick="deleteUser(${user.id})">Sil</button>
    `;
    return userCard;
}

//KUllanıcı Silme
function deleteUser(userId){
    const userCard = document.querySelector(`[data-id="${userId}"]`);
    //kart bulunduysa
    if(userCard) {
        userCard.remove();
    }

    //localStorage'dan kaldırma
    const cachedData = JSON.parse(localStorage.getItem('userData')) || [];
    const updatedData = cachedData.filter(user => user.id !== userId);
    localStorage.setItem('userData', JSON.stringify(updatedData));
    
    //tüm kullanıcılar silindiyse zaman damgasını sil
    if (updatedData.length === 0) {
        localStorage.removeItem('userDataTimestamp');
    }
}

//Kullanıcıları görüntüleme
async function displayUsers() {
    const usersContainer = document.getElementById('ins-api-users');
    usersContainer.innerHTML = '';

    try {
        const users = await fetchUsers();

        users.forEach(user => {
            const userCard = createUserCard(user);
            usersContainer.appendChild(userCard);
        });
    } catch (error) {
        usersContainer.innerHTML = `<p style="color: red; text-align: center;">${error.message}</p>`;
    }
}

//Sayfa Yükelndiği zaman
document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    displayUsers();
});