let studentData = [
    { name: "Murtaza", class: "10A" },
    { name: "Nizo", class: "11B" },
    { name: "Faruk", class: "9C" },
];

function renderTable() {
    $("#studentTable").empty();
    studentData.forEach((student, index) => {
        $("#studentTable").append(`
            <tr data-index="${index}">
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td><button class="deleteBtn">Sil</button></td>
            </tr>
        `);
    });
}

$("#studentForm").submit(function(e) {
    e.preventDefault();
    let name = $("#name").val();
    let className = $("#class").val();
    if (name && className) {
        studentData.push({ name, class: className });
        renderTable();
        $("#name, #class").val("");
    }
});

$(document).on("click", ".deleteBtn", function() {
    let index = $(this).closest("tr").data("index");
    studentData.splice(index, 1);
    renderTable();
});

$(document).on("click", "tr", function() {
    $(this).toggleClass("highlight");
});

// mouseover - Satırın üzerine gelince rengi değiştiriyor.
$(document).on("mouseover", "tr", function() {
    $(this).addClass("hovered");
}).on("mouseout", "tr", function() {
    $(this).removeClass("hovered");
});

// focus - Input'a tıklanınca arka plan rengini değiştiriyor.
$("input").focus(function() {
    $(this).css("background-color", "lightblue");
});

// blur - Input'tan çıkınca eski haline döndürüyor.
$("input").blur(function() {
    $(this).css("background-color", "white");
});

// keydown - Tuşa basılınca konsola yazdırıyor.
$("input").keydown(function(event) {
    console.log("Tuşa basıldı: " + event.key);
});

// keyup - Tuş bırakılınca konsola yazdırıyor.
$("input").keyup(function(event) {
    console.log("Tuş bırakıldı: " + event.key);
});

// change - Input değeri değiştiğinde konsola yazdırıyor.
$("input").change(function() {
    console.log("Girdi değişti: " + $(this).val());
});

renderTable();
